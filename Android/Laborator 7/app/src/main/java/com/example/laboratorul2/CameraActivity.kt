package com.example.laboratorul2

import android.annotation.SuppressLint
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
import android.graphics.Bitmap
import android.graphics.ImageFormat
import android.hardware.Sensor
import android.hardware.camera2.CameraCaptureSession
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraDevice
import android.hardware.camera2.CameraManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.media.ImageReader
import android.net.Uri
import android.os.Environment
import android.os.Handler
import android.provider.MediaStore
import android.provider.Settings
import android.util.Log
import android.view.Surface
import android.view.SurfaceHolder
import android.widget.TextView
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import kotlinx.android.synthetic.main.camera_activity.*
import kotlinx.android.synthetic.main.content_scrolling.*
import kotlinx.android.synthetic.main.sensors_activity.*
import java.io.File
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.*
import java.util.jar.Manifest
import kotlin.collections.ArrayList


class CameraActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.camera_activity)
        if (!CameraPermissionHelper.hasCameraPermission(this)) {
            CameraPermissionHelper.requestCameraPermission(this)
            return
        }
        val surfaceReadyCallback = object: SurfaceHolder.Callback {
            override fun surfaceChanged(p0: SurfaceHolder?, p1: Int, p2: Int, p3: Int) { }
            override fun surfaceDestroyed(p0: SurfaceHolder?) { }

            override fun surfaceCreated(p0: SurfaceHolder?) {
                startCameraSession()
            }
        }
        surfaceView.holder.addCallback(surfaceReadyCallback)

    }

    object CameraPermissionHelper {
        private const val CAMERA_PERMISSION_CODE = 0
        private const val CAMERA_PERMISSION = android.Manifest.permission.CAMERA

        fun hasCameraPermission(activity: Activity): Boolean {
            return ContextCompat.checkSelfPermission(
                activity,
                CAMERA_PERMISSION
            ) == PackageManager.PERMISSION_GRANTED
        }
        fun requestCameraPermission(activity: Activity) {
            ActivityCompat.requestPermissions(
                activity, arrayOf(CAMERA_PERMISSION), CAMERA_PERMISSION_CODE
            )
        }
        fun shouldShowRequestPermissionRationale(activity: Activity): Boolean {
            return ActivityCompat.shouldShowRequestPermissionRationale(activity, CAMERA_PERMISSION)
        }
        fun launchPermissionSettings(activity: Activity) {
            val intent = Intent()
            intent.action = Settings.ACTION_APPLICATION_DETAILS_SETTINGS
            intent.data = Uri.fromParts("package", activity.packageName, null)
            activity.startActivity(intent)
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        if (!CameraPermissionHelper.hasCameraPermission(this)) {
            Toast.makeText(
                this,
                "Camera permission is needed to run this application",
                Toast.LENGTH_LONG
            ).show()
            if (!CameraPermissionHelper.shouldShowRequestPermissionRationale(this)) {
                CameraPermissionHelper.launchPermissionSettings(this)
            }
            finish()
        }
        recreate()
    }

    @SuppressLint("MissingPermission")
    private fun startCameraSession() {

        val cameraManager = getSystemService(Context.CAMERA_SERVICE) as CameraManager
        if (cameraManager.cameraIdList.isEmpty()) {
            return
        }
        val firstCamera = cameraManager.cameraIdList[0]

        cameraManager.openCamera(firstCamera, object : CameraDevice.StateCallback() {
            override fun onDisconnected(p0: CameraDevice) {}
            override fun onError(p0: CameraDevice, p1: Int) {}
            override fun onOpened(cameraDevice: CameraDevice) {
                val cameraCharacteristics = cameraManager.getCameraCharacteristics(cameraDevice.id)
                val previewSurface = surfaceView.holder.surface
                val captureCallback = object : CameraCaptureSession.StateCallback()
                {
                    override fun onConfigureFailed(session: CameraCaptureSession) {}

                    override fun onConfigured(session: CameraCaptureSession) {
                        val previewRequestBuilder =   cameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW)
                            .apply {
                                addTarget(previewSurface)
                            }
                        session.setRepeatingRequest(
                            previewRequestBuilder.build(),
                            object: CameraCaptureSession.CaptureCallback() {},
                            Handler { true }
                        )
                    }
                }

                cameraDevice.createCaptureSession(mutableListOf(previewSurface), captureCallback, Handler { true })
                cameraCharacteristics[CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP]?.let { streamConfigurationMap ->
                    streamConfigurationMap.getOutputSizes(ImageFormat.YUV_420_888)
                        ?.let { yuvSizes ->
//                            val previewSize = yuvSizes.last()
//                            val displayRotation = windowManager.defaultDisplay.rotation
//                            val swappedDimensions = areDimensionsSwapped(displayRotation, cameraCharacteristics)
//                            val rotatedPreviewWidth = if (swappedDimensions) previewSize.height else previewSize.width
//                            val rotatedPreviewHeight = if (swappedDimensions) previewSize.width else previewSize.height
//                            surfaceView.holder.setFixedSize(rotatedPreviewWidth, rotatedPreviewHeight)
//                            val imageReader = ImageReader.newInstance(rotatedPreviewWidth, rotatedPreviewHeight,
//                                ImageFormat.YUV_420_888, 2)
//                            imageReader.setOnImageAvailableListener({
//                            }, Handler { true })
//                            val previewSurface = surfaceView.holder.surface
//                            val recordingSurface = imageReader.surface
//                            cameraDevice.createCaptureSession(mutableListOf(previewSurface, recordingSurface), captureCallback, Handler { true })
//                            imageReader.setOnImageAvailableListener({
//                                imageReader.acquireLatestImage()?.let { image ->
//                                }
//                            }, Handler { true })
                        }

                }
            }
        }, Handler { true })
    }

    private fun areDimensionsSwapped(
        displayRotation: Int,
        cameraCharacteristics: CameraCharacteristics
    ): Boolean {
        var swappedDimensions = false
        when (displayRotation) {
            Surface.ROTATION_0, Surface.ROTATION_180 -> {
                if (cameraCharacteristics.get(CameraCharacteristics.SENSOR_ORIENTATION) == 90 || cameraCharacteristics.get(
                        CameraCharacteristics.SENSOR_ORIENTATION
                    ) == 270
                ) {
                    swappedDimensions = true
                }
            }
            Surface.ROTATION_90, Surface.ROTATION_270 -> {
                if (cameraCharacteristics.get(CameraCharacteristics.SENSOR_ORIENTATION) == 0 || cameraCharacteristics.get(
                        CameraCharacteristics.SENSOR_ORIENTATION
                    ) == 180
                ) {
                    swappedDimensions = true
                }
            }
        }
        return swappedDimensions
    }
}


