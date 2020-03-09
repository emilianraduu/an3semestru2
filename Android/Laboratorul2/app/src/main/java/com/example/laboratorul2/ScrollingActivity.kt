package com.example.laboratorul2

import android.app.AlertDialog
import android.os.Bundle
import android.os.PersistableBundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import android.view.Menu
import android.view.MenuItem
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import kotlinx.android.synthetic.main.activity_scrolling.*
import kotlinx.android.synthetic.main.content_scrolling.*


class ScrollingActivity : AppCompatActivity() {
    var Array = ArrayList<String>()

    override fun onCreate(savedInstanceState: Bundle?) {

        Toast.makeText(applicationContext, "START", Toast.LENGTH_SHORT).show()

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_scrolling)
        setSupportActionBar(toolbar)

        fab.setOnClickListener { view ->
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
                updateData(Array)
            }

            builder.setNeutralButton("Cancel") { _, _ ->
                Toast.makeText(applicationContext, "You cancelled the dialog.", Toast.LENGTH_SHORT)
                    .show()
            }

            val dialog: AlertDialog = builder.create()

            dialog.show()
        }
        val empty = TextView(this)
        empty.textSize = 20f
        empty.text = "Your list is empty, please add an item"
        items.addView(empty)


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
            updateData(Array)
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_settings -> true
            else -> super.onOptionsItemSelected(item)
        }
    }


    fun updateData(Array: ArrayList<String>) {
        items.removeAllViews()
        for (i in Array) {
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

