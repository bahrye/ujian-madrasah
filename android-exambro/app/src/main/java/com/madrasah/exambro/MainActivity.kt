package com.madrasah.exambro

import android.Manifest
import android.content.Context
import android.content.DialogInterface
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.os.Build
import android.os.Bundle
import android.text.InputType
import android.view.View
import android.view.WindowManager
import android.webkit.CookieManager
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private lateinit var layoutError: LinearLayout
    private lateinit var btnRetry: Button
    private lateinit var btnSettings: Button
    private lateinit var proctorTrigger: View

    private lateinit var prefs: SharedPreferences

    private var tripleTapCount = 0
    private var lastTapTime = 0L
    private var hasLeftApp = false
    private var isRequestingPermission = false
    private var isAppStarted = false
    private var currentUrl: String = ""

    companion object {
        private const val PREFS_NAME = "exambro_prefs"
        private const val KEY_EXAM_URL = "exam_url"
        private const val KEY_VIOLATIONS = "violation_count"
        private const val KEY_PROCTOR_PIN = "proctor_pin"
        private const val DEFAULT_URL = "https://ujian-madrasah.vercel.app"
        private const val DEFAULT_PIN = "12345"
        private const val REQ_CAMERA_PERMISSION = 101
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 1. KEAMANAN: Blokir screenshot & screen recording
        window.setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        )

        // 2. Cegah layar mati selama ujian
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        // 3. Masuk ke mode fullscreen immersive
        applyImmersiveMode()

        setContentView(R.layout.activity_main)

        prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        // Reset pelanggaran setiap kali aplikasi dibuka fresh
        prefs.edit().putInt(KEY_VIOLATIONS, 0).apply()

        initViews()
        setupWebView()
        requestCameraPermissionIfNeeded()

        // Muat URL ujian
        loadExamUrl()

        // Beri jeda 3 detik sebelum mengaktifkan deteksi agar startup/splash tidak memicu peringatan
        window.decorView.postDelayed({
            isAppStarted = true
        }, 3000)
    }

    private fun applyImmersiveMode() {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val controller = WindowInsetsControllerCompat(window, window.decorView)
        controller.hide(WindowInsetsCompat.Type.systemBars())
        controller.systemBarsBehavior =
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            applyImmersiveMode()
        }
    }

    private fun initViews() {
        webView = findViewById(R.id.webView)
        progressBar = findViewById(R.id.progressBar)
        layoutError = findViewById(R.id.layoutError)
        btnRetry = findViewById(R.id.btnRetry)
        btnSettings = findViewById(R.id.btnSettings)
        proctorTrigger = findViewById(R.id.proctorTrigger)

        btnRetry.setOnClickListener {
            layoutError.visibility = View.GONE
            webView.visibility = View.VISIBLE
            webView.reload()
        }

        btnSettings.setOnClickListener {
            promptProctorPinThenShowSettings()
        }

        // Trigger tersembunyi: ketuk 3 kali di pojok kanan atas untuk membuka menu pengawas
        proctorTrigger.setOnClickListener {
            val now = System.currentTimeMillis()
            if (now - lastTapTime < 600) {
                tripleTapCount++
                if (tripleTapCount >= 3) {
                    tripleTapCount = 0
                    promptProctorPinThenShowSettings()
                }
            } else {
                tripleTapCount = 1
            }
            lastTapTime = now
        }
    }

    private fun setupWebView() {
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.loadWithOverviewMode = true
        settings.useWideViewPort = true
        settings.builtInZoomControls = false
        settings.displayZoomControls = false
        settings.setSupportZoom(false)

        // Custom User-Agent agar server mengenali request dari Exambro resmi
        settings.userAgentString = "${settings.userAgentString} ExambroMadrasah/1.0"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true)
        }
        CookieManager.getInstance().setAcceptCookie(true)

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                if (newProgress < 100) {
                    progressBar.visibility = View.VISIBLE
                    progressBar.progress = newProgress
                } else {
                    progressBar.visibility = View.GONE
                }
            }

            // Beri izin akses kamera ke webview (untuk scan QR token)
            override fun onPermissionRequest(request: PermissionRequest?) {
                if (request == null) return
                val resList = request.resources ?: return
                for (resource in resList) {
                    if (resource == PermissionRequest.RESOURCE_VIDEO_CAPTURE) {
                        request.grant(arrayOf(PermissionRequest.RESOURCE_VIDEO_CAPTURE))
                        return
                    }
                }
                request.grant(resList)
            }
        }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                progressBar.visibility = View.VISIBLE
                url?.let { currentUrl = it }
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
                url?.let { currentUrl = it }
            }

            override fun doUpdateVisitedHistory(view: WebView?, url: String?, isReload: Boolean) {
                super.doUpdateVisitedHistory(view, url, isReload)
                url?.let { currentUrl = it }
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                if (request?.isForMainFrame == true) {
                    webView.visibility = View.GONE
                    layoutError.visibility = View.VISIBLE
                }
            }

            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val url = request?.url?.toString() ?: return false
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    return false
                }
                return true
            }
        }
    }

    private fun loadExamUrl() {
        val url = prefs.getString(KEY_EXAM_URL, DEFAULT_URL) ?: DEFAULT_URL
        currentUrl = url
        webView.loadUrl(url)
    }

    private fun requestCameraPermissionIfNeeded() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
            != PackageManager.PERMISSION_GRANTED
        ) {
            isRequestingPermission = true
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.CAMERA),
                REQ_CAMERA_PERMISSION
            )
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == REQ_CAMERA_PERMISSION) {
            // Beri sedikit jeda agar dialog izin tertutup sempurna sebelum membuka deteksi
            window.decorView.postDelayed({
                isRequestingPermission = false
            }, 1000)
        }
    }

    /**
     * Memeriksa apakah siswa sedang berada di dalam halaman pengerjaan ujian.
     * Deteksi pelanggaran HANYA aktif saat siswa berada di ruang ujian aktif.
     */
    private fun isExamInProgress(): Boolean {
        val activeUrl = webView.url ?: currentUrl
        return activeUrl.contains("/siswa/ujian") || activeUrl.contains("/ujian/")
    }

    // 4. DETEKSI SISWA KELUAR APLIKASI (HOME / RECENT APPS / SPLIT SCREEN)
    override fun onUserLeaveHint() {
        super.onUserLeaveHint()

        // Jangan catat pelanggaran jika:
        // 1. Sedang memunculkan dialog izin kamera sistem
        // 2. Aplikasi baru saja dibuka (< 3 detik)
        // 3. Siswa BELUM masuk ke halaman pengerjaan soal ujian (misal masih di login / menu siswa)
        if (isRequestingPermission || !isAppStarted || !isExamInProgress()) {
            return
        }

        hasLeftApp = true
        val currentViolations = prefs.getInt(KEY_VIOLATIONS, 0) + 1
        prefs.edit().putInt(KEY_VIOLATIONS, currentViolations).apply()
    }

    override fun onResume() {
        super.onResume()
        applyImmersiveMode()

        // Tampilkan dialog pelanggaran HANYA jika siswa sedang ujian dan benar-benar keluar
        if (hasLeftApp && isExamInProgress()) {
            hasLeftApp = false
            val count = prefs.getInt(KEY_VIOLATIONS, 0)
            showViolationWarningDialog(count)
        } else {
            hasLeftApp = false
        }
    }

    private fun showViolationWarningDialog(violationCount: Int) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle(getString(R.string.warning_violation_title))
        builder.setMessage(getString(R.string.warning_violation_msg, violationCount))
        builder.setCancelable(false)
        builder.setPositiveButton("Saya Mengerti") { dialog, _ ->
            dialog.dismiss()
            applyImmersiveMode()
        }
        val alert = builder.create()
        alert.show()
    }

    // 5. BLOKIR TOMBOL KEMBALI
    @Suppress("DEPRECATION")
    override fun onBackPressed() {
        if (isExamInProgress()) {
            // Saat sedang ujian: Tombol kembali DIBLOKIR, butuh PIN Pengawas untuk keluar
            promptProctorPinToExit()
        } else {
            // Saat belum masuk ujian (Login/Dashboard): Bisa navigasi kembali atau konfirmasi keluar biasa
            if (webView.canGoBack()) {
                webView.goBack()
            } else {
                showNormalExitDialog()
            }
        }
    }

    private fun showNormalExitDialog() {
        AlertDialog.Builder(this)
            .setTitle("Keluar Aplikasi")
            .setMessage("Apakah Anda yakin ingin menutup aplikasi ujian?")
            .setPositiveButton("Ya") { _, _ -> finish() }
            .setNegativeButton("Tidak") { dialog, _ ->
                dialog.dismiss()
                applyImmersiveMode()
            }
            .show()
    }

    private fun promptProctorPinToExit() {
        val input = EditText(this)
        input.inputType = InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_VARIATION_PASSWORD
        input.hint = getString(R.string.dialog_pin_hint)

        val container = LinearLayout(this)
        container.orientation = LinearLayout.VERTICAL
        val params = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        )
        params.setMargins(60, 20, 60, 10)
        input.layoutParams = params
        container.addView(input)

        AlertDialog.Builder(this)
            .setTitle(getString(R.string.dialog_exit_title))
            .setMessage(getString(R.string.dialog_exit_msg))
            .setView(container)
            .setCancelable(false)
            .setPositiveButton(getString(R.string.dialog_btn_exit)) { _, _ ->
                val enteredPin = input.text.toString().trim()
                val correctPin = prefs.getString(KEY_PROCTOR_PIN, DEFAULT_PIN) ?: DEFAULT_PIN
                if (enteredPin == correctPin) {
                    finish()
                } else {
                    Toast.makeText(this, getString(R.string.pin_wrong), Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton(getString(R.string.dialog_btn_cancel)) { dialog, _ ->
                dialog.dismiss()
                applyImmersiveMode()
            }
            .show()
    }

    private fun promptProctorPinThenShowSettings() {
        val input = EditText(this)
        input.inputType = InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_VARIATION_PASSWORD
        input.hint = "PIN Pengawas (Default: 12345)"

        val container = LinearLayout(this)
        container.orientation = LinearLayout.VERTICAL
        val params = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        )
        params.setMargins(60, 20, 60, 10)
        input.layoutParams = params
        container.addView(input)

        AlertDialog.Builder(this)
            .setTitle("Autentikasi Pengawas")
            .setMessage("Masukkan PIN Pengawas untuk mengakses pengaturan server:")
            .setView(container)
            .setPositiveButton("Buka") { _, _ ->
                val enteredPin = input.text.toString().trim()
                val correctPin = prefs.getString(KEY_PROCTOR_PIN, DEFAULT_PIN) ?: DEFAULT_PIN
                if (enteredPin == correctPin) {
                    showSettingsDialog()
                } else {
                    Toast.makeText(this, getString(R.string.pin_wrong), Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton(getString(R.string.dialog_btn_cancel), null)
            .show()
    }

    private fun showSettingsDialog() {
        val view = layoutInflater.inflate(R.layout.dialog_settings, null)
        val etUrl = view.findViewById<EditText>(R.id.etExamUrl)
        val tvViolations = view.findViewById<TextView>(R.id.tvViolationStatus)
        val btnResetViolations = view.findViewById<Button>(R.id.btnResetViolations)

        val currentStoredUrl = prefs.getString(KEY_EXAM_URL, DEFAULT_URL) ?: DEFAULT_URL
        etUrl.setText(currentStoredUrl)

        fun updateViolationText() {
            val count = prefs.getInt(KEY_VIOLATIONS, 0)
            tvViolations.text = "Jumlah Pelanggaran Siswa: $count kali"
        }
        updateViolationText()

        btnResetViolations.setOnClickListener {
            prefs.edit().putInt(KEY_VIOLATIONS, 0).apply()
            updateViolationText()
            Toast.makeText(this, "Riwayat pelanggaran berhasil di-reset ke 0", Toast.LENGTH_SHORT).show()
        }

        AlertDialog.Builder(this)
            .setView(view)
            .setPositiveButton("Simpan & Muat Ulang") { _, _ ->
                val newUrl = etUrl.text.toString().trim()
                if (newUrl.isNotEmpty()) {
                    prefs.edit().putString(KEY_EXAM_URL, newUrl).apply()
                    currentUrl = newUrl
                    layoutError.visibility = View.GONE
                    webView.visibility = View.VISIBLE
                    webView.loadUrl(newUrl)
                    Toast.makeText(this, "Server disimpan: $newUrl", Toast.LENGTH_SHORT).show()
                }
                applyImmersiveMode()
            }
            .setNegativeButton("Batal") { dialog, _ ->
                dialog.dismiss()
                applyImmersiveMode()
            }
            .show()
    }
}
