package com.example.megaconvertor.ui.currency

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Spinner
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.android.volley.toolbox.JsonObjectRequest
import androidx.lifecycle.ViewModelProviders
import com.android.volley.Response
import com.example.megaconvertor.R
import java.lang.Error
import java.text.DecimalFormat
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import kotlinx.android.synthetic.main.fragment_home.*
import org.json.JSONObject
import com.android.volley.toolbox.Volley
import com.google.android.material.snackbar.Snackbar

class CurrencyFragment : Fragment() {
    var selectedFirstValue = ""
    var selectedSecondValue = ""
    var options = JsonObject()
    private lateinit var homeViewModel: CurrencyViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        homeViewModel =
            ViewModelProviders.of(this).get(CurrencyViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_home, container, false)

        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        getRequest()
        initKeyboard()
        valSpinners()
    }

    fun valSpinners() {
        val1.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(
                parent: AdapterView<*>,
                view: View,
                position: Int,
                id: Long
            ) {
                if (parent.getItemAtPosition(position).toString() != selectedFirstValue) {
                    selectedFirstValue = parent.getItemAtPosition(position).toString()
                    getRequest(selectedFirstValue!!.toString())
                }
            }

            override fun onNothingSelected(parent: AdapterView<*>) {
            }
        }
        val2.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(
                parent: AdapterView<*>,
                view: View,
                position: Int,
                id: Long
            ) {
                if (parent.getItemAtPosition(position).toString() != selectedSecondValue) {
                    selectedSecondValue = parent.getItemAtPosition(position).toString()
                    updateValues()
                }
            }

            override fun onNothingSelected(parent: AdapterView<*>) {
            }
        }
    }

    fun initKeyboard() {
        input!!.setText("0")
        result.setText("0")
        result.setOnClickListener { v ->
            val snackbar = Snackbar.make(
                root, "Value copied to clipboard.",
                Snackbar.LENGTH_LONG
            ).setAction("Action", null)
            snackbar.show()
            var myClipboard =
                context!!.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            var myClip: ClipData = ClipData.newPlainText("conversion_copy", result.text)
            myClipboard.setPrimaryClip(myClip)
        }
        bpoint.setOnClickListener { v ->
            setValue(".")
        }
        b0.setOnClickListener { v ->
            setValue("0")
        }
        b1.setOnClickListener { v ->
            setValue("1")
        }
        b2.setOnClickListener { v ->
            setValue("2")
        }
        b3.setOnClickListener { v ->
            setValue("3")
        }
        b4.setOnClickListener { v ->
            setValue("4")
        }
        b5.setOnClickListener { v ->
            setValue("5")
        }
        b6.setOnClickListener { v ->
            setValue("6")
        }
        b7.setOnClickListener { v ->
            setValue("7")
        }
        b8.setOnClickListener { v ->
            setValue("8")
        }
        b9.setOnClickListener { v ->
            setValue("9")
        }
        bdel.setOnClickListener { v ->
            deleteValue()
        }
    }

    fun deleteValue() {
        var text = input.getText().toString()
        var subtext = text.substring(0, text.length - 1)
        if (subtext != "") {
            input.setText(text.substring(0, text.length - 1))
        } else {
            input.setText("0")
        }
        val inputFloat = input.text.toString().toFloat()
        val outputValue = options[val2.selectedItem.toString()].toString().toFloat()
        val decimalFormat = DecimalFormat("#.##")
        val res = decimalFormat.format(outputValue * inputFloat)
        result.text = res.toString()
    }

    fun setupSpinner(selected: String, spinner: Spinner, first: Boolean = true) {
        val keys = options.keySet()
        var list = mutableListOf<String>()
        for (entry in keys) {
            if (entry != selected) {
                list.add(entry)
            }
        }
        list.sort()
        if (selected != "") {
            list.add(0, selected)
        }
        val adapter: ArrayAdapter<String> = object : ArrayAdapter<String>(
            activity!!.applicationContext,
            android.R.layout.simple_spinner_dropdown_item,
            list
        ) {
            override fun getDropDownView(
                position: Int,
                convertView: View?,
                parent: ViewGroup
            ): View {
                val view: TextView = super.getDropDownView(
                    position,
                    convertView,
                    parent
                ) as TextView

                view.setTypeface(Typeface.SANS_SERIF, Typeface.BOLD)
                view.background = ColorDrawable(Color.parseColor("#455a64"))

                return view
            }
        }
        spinner.adapter = adapter

    }

    fun setupValues() {
        setupSpinner(selectedFirstValue, val1)
        setupSpinner(selectedSecondValue, val2, false)
        updateValues()
    }

    fun getRequest(base: String = "RON") {
        val queue = Volley.newRequestQueue(activity)
        val url = "https://api.exchangeratesapi.io/latest?base=" + base
        val request = JsonObjectRequest(url, null, Response.Listener<JSONObject>()
        { response ->
            val rates = response["rates"].toString()
            val gotOptions = JsonParser().parse(rates).asJsonObject
            for (i in gotOptions.keySet()) {
                options.add(i, gotOptions[i])
            }
            val snackbar = Snackbar.make(
                root, "Latest currency values updated",
                Snackbar.LENGTH_LONG
            ).setAction("Action", null)
            snackbar.show()
            setupValues()

        }, Response.ErrorListener { error -> Log.d("error", error.toString()) })
        queue.add(request)
    }

    fun setValue(value: String) {
        var text = input.getText().toString()
        if (text == "0") {
            if (value != "0" && value != ".") {
                input.setText(value)
            }
            if (value == ".") {
                if (value in text) {
                } else {
                    input.setText(text + value)
                }
            }
        } else {
            if (value == ".") {
                if (value in text) {
                } else {
                    input.setText(text + value)
                }
            } else {
                input.setText(text + value)
            }
        }
        updateValues()
    }

    fun updateValues() {
        if (selectedSecondValue != "" && options[selectedSecondValue] != null) {
            try {
                val inputFloat = input.text!!.toString()!!.toFloat()
                val outputValue = options[selectedSecondValue]!!.toString().toFloat()
                val decimalFormat = DecimalFormat("#.##")
                val res = decimalFormat.format(inputFloat * outputValue)
                result.text = res.toString()
            } catch (error: Error) {

            }
        }
    }
}