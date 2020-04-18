package com.example.laboratorul2

import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.os.PersistableBundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.annotation.Nullable
import androidx.preference.SwitchPreferenceCompat
import kotlinx.android.synthetic.main.activity_scrolling.*
import kotlinx.android.synthetic.main.content_scrolling.*


class ScrollingActivity : AppCompatActivity() {
    var Array = ArrayList<String>()
    var filter = String()
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_scrolling)
        setSupportActionBar(toolbar)

        fab.setOnClickListener { view -> listener(view) }
        val empty = TextView(this)
        empty.textSize = 20f
        empty.text = "Your list is empty, please add an item"
        items.addView(empty)
        Toast.makeText(applicationContext, "START", Toast.LENGTH_SHORT).show()
        filter = ""
        var sharedPreference = SharedPreference(this)
        val save = sharedPreference.getValueString("Save items on restart")
        val search = sharedPreference.getValueString("Save search field")
        if (search == "true") {
            val searchFilter = sharedPreference.getValueString("filter")
            if (searchFilter != null) {
                filter = searchFilter
            }
        }
        if (save == "true") {
            for (i in 0..200) {
                val item = sharedPreference.getValueString(i.toString())
                if (item != null) {
                    Array.add(item)
                    updateData()
                }
            }

        }

    }


    fun listener(view: View) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Add an item")

        var name = EditText(this)
        name.setHint("Product name")
        builder.setView(name)

        builder.setPositiveButton("Save") { dialog, which ->
            Toast.makeText(applicationContext, "Item added!.", Toast.LENGTH_SHORT).show()
            val item = TextView(this)
            item.textSize = 20f
            item.text = name.text
            item.isClickable = true
            item.setOnClickListener { _ ->
                Toast.makeText(applicationContext, item.text, Toast.LENGTH_SHORT).show()

            }

            Array.add(item.text.toString())
            Log.d("array update", Array.toString())
            updateData()
        }

        builder.setNeutralButton("Cancel") { _, _ ->
            Toast.makeText(applicationContext, "You cancelled the dialog.", Toast.LENGTH_SHORT)
                .show()
        }

        val dialog: AlertDialog = builder.create()

        dialog.show()
    }

    override fun onResume() {
        super.onResume()
        Toast.makeText(applicationContext, "RESUME", Toast.LENGTH_SHORT).show()
    }

    override fun onPause() {
        super.onPause()
        Toast.makeText(applicationContext, "PAUSE", Toast.LENGTH_SHORT).show()
    }

    override fun onStop() {
        super.onStop()
        Toast.makeText(applicationContext, "STOP", Toast.LENGTH_SHORT).show()
    }

    override fun onDestroy() {
        super.onDestroy()
        Toast.makeText(applicationContext, "DESTROY", Toast.LENGTH_SHORT).show()
        var sharedPreference: SharedPreference = SharedPreference(this)
        val save = sharedPreference.getValueString("Save items on restart")
        val search = sharedPreference.getValueString("Save search field")

        if (save == "true") {
            var index = 0
            for (item in Array) {
                sharedPreference.save(index.toString(), item)
                index += 1
            }
        } else {
            for (i in 0..200) {
                sharedPreference.removeValue(i.toString())
            }
        }

        if (search == "true") {
            sharedPreference.save("filter", filter)
        } else {
            sharedPreference.removeValue("filter")

        }

    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.menu_scrolling, menu)
        return true
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        Log.d("array save", Array.toString())
        outState.putStringArrayList("array", Array)
    }

    override fun onRestoreInstanceState(savedInstanceState: Bundle) {
        super.onRestoreInstanceState(savedInstanceState)
        val arraylist = savedInstanceState.getStringArrayList("array")
        Log.d("array get", arraylist.toString())
        if (arraylist != null) {
            for (i in arraylist) {
                Array.add(i)
            }
            updateData()
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_settings -> {
                openSettings(this)
                true
            }
            R.id.action_search -> {
                showSearchAlert()
                true
            }
            R.id.action_sensors -> {
                openSensors(this)
                true
            }
            R.id.action_camera -> {
                openCamera(this)
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    fun showSearchAlert() {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Search for an item")

        var name = EditText(this)
        name.setHint("Product name")
        builder.setView(name)

        builder.setPositiveButton("Search") { dialog, which ->
            Toast.makeText(applicationContext, "Filter added!.", Toast.LENGTH_SHORT).show()
            filter = name.text.toString()
            updateData()
        }

        builder.setNeutralButton("Cancel") { _, _ ->
            Toast.makeText(applicationContext, "You cancelled the dialog.", Toast.LENGTH_SHORT)
                .show()
        }

        val dialog: AlertDialog = builder.create()

        dialog.show()
    }

    fun openSettings(view: ScrollingActivity) {
        val intent = Intent(this, SettingsActivity::class.java).apply {}
        startActivity(intent)
    }

    fun openCamera(view: ScrollingActivity) {
        val intent = Intent(this, CameraActivity::class.java).apply {}
        startActivity(intent)
    }
    fun openSensors(view: ScrollingActivity) {
        val intent = Intent(this, SensorsActivity::class.java).apply {}
        startActivity(intent)
    }

    fun updateData() {
        items.removeAllViews()
        for (i in Array) {
            if (filter !== "") {

                if (i.contains(filter)) {
                    val item = TextView(this)
                    item.textSize = 20f
                    item.text = i
                    item.isClickable = true
                    item.setOnClickListener { _ ->
                        Toast.makeText(applicationContext, item.text, Toast.LENGTH_SHORT).show()
                    }
                    items.addView(item)
                }
            } else {

                val item = TextView(this)
                item.textSize = 20f
                item.text = i
                item.isClickable = true
                item.setOnClickListener { _ ->
                    Toast.makeText(applicationContext, item.text, Toast.LENGTH_SHORT).show()
                }
                items.addView(item)
            }
        }
    }

}

