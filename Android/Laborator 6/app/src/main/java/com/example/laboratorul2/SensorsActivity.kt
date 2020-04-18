package com.example.laboratorul2

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.hardware.SensorEvent
import android.hardware.SensorManager
import android.hardware.Sensor.TYPE_ACCELEROMETER
import android.content.Context.SENSOR_SERVICE
import androidx.core.content.ContextCompat.getSystemService
import android.hardware.SensorEventListener
import android.app.Activity
import android.app.Service
import android.content.Context
import android.content.Context.LOCATION_SERVICE
import android.content.Intent
import android.content.pm.PackageManager
import android.hardware.Sensor
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.util.Log
import android.widget.TextView
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import kotlinx.android.synthetic.main.content_scrolling.*
import kotlinx.android.synthetic.main.sensors_activity.*
import java.util.*
import java.util.jar.Manifest
import kotlin.collections.ArrayList


class SensorsActivity : Activity(), SensorEventListener {
    private lateinit var mSensorManager: SensorManager
    private var mSensors: Sensor? = null
    private var mAccelerometer: Sensor? = null
    private var mProximity: Sensor? = null
    private var mGyroscope: Sensor? = null
    private var mGravity: Sensor? = null


    var Array = ArrayList<Sensor>()
    var Values: MutableMap<Any, Any> = mutableMapOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.sensors_activity)

        mSensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        mSensorManager.registerListener(this, mSensors, SensorManager.SENSOR_DELAY_NORMAL)
        mAccelerometer = mSensorManager!!.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        mProximity = mSensorManager!!.getDefaultSensor(Sensor.TYPE_PROXIMITY)
        mGyroscope = mSensorManager!!.getDefaultSensor(Sensor.TYPE_GYROSCOPE)
        mGravity = mSensorManager!!.getDefaultSensor(Sensor.TYPE_GRAVITY)

        val deviceSensors: List<Sensor> = mSensorManager.getSensorList(Sensor.TYPE_ALL)
        val item = TextView(this)
        item.text = "Total sensors: " + deviceSensors.size
        layout2.addView(item)
        deviceSensors.forEach {
            Array.add(it)
        }
        locationtext.text = "Location is: -"
        LocationHelper().startListeningUserLocation(
            this,
            object : LocationHelper.MyLocationListener {
                override fun onLocationChanged(location: Location) {
                    locationtext.text =
                        "Location is: " + location.latitude + "," + location.longitude
                }
            })
        updateData()
    }

    fun updateData() {
        layout2.removeAllViews()
        for (i in Array) {
            val item = TextView(this)
            if (Values[i.name] != null) {
                item.text = i.name.toString() + " - " + Values[i.name]
            } else {
                item.text = i.name.toString() + " -"
            }
            layout2.addView(item)
        }
    }

    override fun onAccuracyChanged(p0: Sensor?, p1: Int) {
    }

    override fun onSensorChanged(p0: SensorEvent?) {
        Values.put(p0!!.sensor.name.toString(), p0!!.values[0])
        updateData()
    }

    override fun onResume() {
        super.onResume()
        mSensorManager!!.registerListener(
            this, mAccelerometer,
            SensorManager.SENSOR_DELAY_GAME
        )
        mSensorManager!!.registerListener(
            this, mGyroscope,
            SensorManager.SENSOR_DELAY_GAME
        )
        mSensorManager!!.registerListener(
            this, mProximity,
            SensorManager.SENSOR_DELAY_GAME
        )
        mSensorManager!!.registerListener(
            this, mGravity,
            SensorManager.SENSOR_DELAY_GAME
        )

    }

    override fun onPause() {
        super.onPause()
        mSensorManager!!.unregisterListener(this)
    }
}

class LocationHelper {

    val LOCATION_REFRESH_TIME = 3000 // 3 seconds. The Minimum Time to get location update
    val LOCATION_REFRESH_DISTANCE =
        30 // 30 meters. The Minimum Distance to be changed to get location update
    val MY_PERMISSIONS_REQUEST_LOCATION = 100

    var myLocationListener: MyLocationListener? = null

    interface MyLocationListener {
        fun onLocationChanged(location: Location)
    }

    fun startListeningUserLocation(context: Context, myListener: MyLocationListener) {
        myLocationListener = myListener

        val mLocationManager = context.getSystemService(LOCATION_SERVICE) as LocationManager

        val mLocationListener = object : LocationListener {
            override fun onLocationChanged(location: Location) {
                myLocationListener!!.onLocationChanged(location)
            }

            override fun onStatusChanged(provider: String, status: Int, extras: Bundle) {}
            override fun onProviderEnabled(provider: String) {}
            override fun onProviderDisabled(provider: String) {}
        }
        if (ContextCompat.checkSelfPermission(
                context,
                android.Manifest.permission.ACCESS_COARSE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED && ContextCompat.checkSelfPermission(
                context,
                android.Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            mLocationManager.requestLocationUpdates(
                LocationManager.GPS_PROVIDER,
                LOCATION_REFRESH_TIME.toLong(),
                LOCATION_REFRESH_DISTANCE.toFloat(),
                mLocationListener
            )
        } else {
            if (ActivityCompat.shouldShowRequestPermissionRationale(
                    context as Activity,
                    android.Manifest.permission.ACCESS_FINE_LOCATION
                ) || ActivityCompat.shouldShowRequestPermissionRationale(
                    context as Activity,
                    android.Manifest.permission.ACCESS_COARSE_LOCATION
                )
            ) {
            } else {
                ActivityCompat.requestPermissions(
                    context,
                    arrayOf(
                        android.Manifest.permission.ACCESS_FINE_LOCATION,
                        android.Manifest.permission.ACCESS_COARSE_LOCATION
                    ),
                    MY_PERMISSIONS_REQUEST_LOCATION
                )
            }
        }
    }

}