package com.example.laboratorul2

import android.app.AlertDialog
import android.graphics.Color
import android.os.Bundle
import com.google.android.material.snackbar.Snackbar
import androidx.appcompat.app.AppCompatActivity
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import kotlinx.android.synthetic.main.activity_scrolling.*
import kotlinx.android.synthetic.main.content_scrolling.*


class ScrollingActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_scrolling)
        setSupportActionBar(toolbar)
        val Array = ArrayList<View>()

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

                Array.add(item)
                updateData(Array)
            }

            builder.setNeutralButton("Cancel") { _, _ ->
                Toast.makeText(applicationContext, "You cancelled the dialog.", Toast.LENGTH_SHORT).show()
            }

            val dialog: AlertDialog = builder.create()

            dialog.show()
        }
        val empty = TextView(this)
        empty.textSize = 20f
        empty.text = "Your list is empty, please add an item"
        items.addView(empty)

    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.menu_scrolling, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_settings -> true
            else -> super.onOptionsItemSelected(item)
        }
    }

    fun updateData(Array: ArrayList<View>) {
        items.removeAllViews()
        for (i in Array) {
            items.addView(i)
        }
    }
}

