package com.madrasah.exambro

import android.Manifest
import android.annotation.SuppressLint
import android.app.ActivityManager
import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.text.InputType
import android.view.MotionEvent
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
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.RelativeLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.google.android.material.button.MaterialButton
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

class MainActivity : AppCompatActivity() {

    // Komponen Tampilan Utama
    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private lateinit var layoutError: LinearLayout
    private lateinit var btnRetry: Button
    private lateinit var btnSettings: Button
    private lateinit var btnBackToLandingFromError: Button
    private lateinit var proctorTrigger: View

    // Komponen Beranda / Landing Screen
    private lateinit var layoutLanding: RelativeLayout
    private lateinit var btnEnterExam: MaterialButton
    private lateinit var btnCheckUpdateLanding: MaterialButton
    private lateinit var btnAboutUsLanding: MaterialButton
    private lateinit var btnLandingSettings: ImageButton
    private lateinit var tvLandingServerStatus: TextView
    private lateinit var tvLandingVersion: TextView

    private lateinit var prefs: SharedPreferences

    private var tripleTapCount = 0
    private var lastTapTime = 0L
    private var hasLeftApp = false
    private var isRequestingPermission = false
    private var isAppStarted = false
    private var currentUrl: String = ""
    private var currentExamExitPin: String? = null
    private var isExamPaused: Boolean = false
    private var isExamActive: Boolean = false
    private var touchStartedInTopZone: Boolean = false
    private var currentAttemptId: String? = null
    private var pinPollThread: Thread? = null

    companion object {
        private const val PREFS_NAME = "exambro_prefs"
        private const val KEY_EXAM_URL = "exam_url"
        private const val KEY_VIOLATIONS = "violation_count"
        private const val KEY_PROCTOR_PIN = "proctor_pin"
        private const val DEFAULT_URL = "https://ujian-madrasah.vercel.app"
        private const val DEFAULT_PIN = "12345"
        private const val REQ_CAMERA_PERMISSION = 101
        private const val AUTHOR_NAME = "Syamsul Bahri"
        private const val AUTHOR_WA_LINK = "https://wa.me/qr/FMVS3NLDIRUAA1"
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

        // 3. Set content view terlebih dahulu sebelum inisialisasi tampilan
        setContentView(R.layout.activity_main)

        prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        // Reset pelanggaran setiap kali aplikasi dibuka fresh
        prefs.edit().putInt(KEY_VIOLATIONS, 0).apply()

        initViews()
        setupWebView()
        applyImmersiveMode()
        requestCameraPermissionIfNeeded()

        // Tampilkan Beranda Landing Screen saat aplikasi pertama kali dibuka
        showLandingScreen()

        // Beri jeda 3 detik sebelum mengaktifkan deteksi agar startup/splash tidak memicu peringatan
        window.decorView.postDelayed({
            isAppStarted = true
        }, 3000)

        // Periksa pembaruan di latar belakang secara otomatis
        window.decorView.postDelayed({
            checkAppUpdate(false)
        }, 8000)
    }

    private fun applyImmersiveMode() {
        try {
            WindowCompat.setDecorFitsSystemWindows(window, false)
            val controller = WindowInsetsControllerCompat(window, window.decorView)
            controller.hide(WindowInsetsCompat.Type.systemBars())

            if (isExamInProgress() && !isExamPaused) {
                // Saat ujian aktif: sembunyikan bilah status permanen dan cegah muncul saat swipe
                controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_DEFAULT
                @Suppress("DEPRECATION")
                window.decorView.systemUiVisibility = (
                    View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_FULLSCREEN
                )
            } else {
                controller.systemBarsBehavior =
                    WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                window.attributes.layoutInDisplayCutoutMode =
                    WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
            }
        } catch (e: Exception) {}
    }

    /**
     * Fetch PIN keluar ujian dari server dengan strategi retry hemat kuota.
     * APK hanya akan mencoba mengambil PIN jika `currentExamExitPin` masih null/kosong,
     * maksimal 3 kali percobaan dengan jeda 30 detik per percobaan.
     *
     * Efisiensi: maks 3 request/siswa per ujian (vs 360 request jika polling konstan 15 detik).
     * PIN di database hampir tidak pernah berubah setelah ujian dimulai, sehingga
     * retry-only jauh lebih tepat daripada polling terus-menerus.
     */
    private fun startPinPolling(attemptId: String) {
        stopPinPolling()
        currentAttemptId = attemptId
        // Jika PIN sudah ada (dari web injection), tidak perlu fetch ke server sama sekali
        if (!currentExamExitPin.isNullOrEmpty()) return
        pinPollThread = Thread {
            var retryCount = 0
            val maxRetries = 3
            val retryDelayMs = 30_000L // 30 detik per percobaan
            while (!Thread.currentThread().isInterrupted && isExamActive && retryCount < maxRetries) {
                try {
                    Thread.sleep(retryDelayMs)
                    if (!isExamActive) break
                    // Jika PIN sudah tersinkron via web (ExambroBridge), berhenti
                    if (!currentExamExitPin.isNullOrEmpty()) break
                    retryCount++
                    val serverUrl = prefs.getString(KEY_EXAM_URL, DEFAULT_URL) ?: DEFAULT_URL
                    val url = java.net.URL("$serverUrl/api/attempt-status/$attemptId")
                    val conn = url.openConnection() as java.net.HttpURLConnection
                    conn.connectTimeout = 5000
                    conn.readTimeout = 5000
                    conn.requestMethod = "GET"
                    if (conn.responseCode == 200) {
                        val reader = java.io.BufferedReader(java.io.InputStreamReader(conn.inputStream))
                        val response = reader.readText()
                        reader.close()
                        val json = org.json.JSONObject(response)
                        val pin = json.optString("exam_exit_pin", "")
                        if (pin.isNotEmpty() && pin != "null") {
                            currentExamExitPin = pin.trim()
                            break // PIN berhasil didapat, tidak perlu retry lagi
                        }
                    }
                    conn.disconnect()
                } catch (e: InterruptedException) {
                    break
                } catch (e: Exception) {}
            }
        }.also { it.isDaemon = true; it.start() }
    }

    private fun stopPinPolling() {
        pinPollThread?.interrupt()
        pinPollThread = null
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (!::webView.isInitialized) return
        if (hasFocus) {
            applyImmersiveMode()
            // Pastikan LockTask hanya diaktifkan jika ujian aktif DAN tidak dalam status ditahan
            if (isExamInProgress() && !isExamPaused) {
                startLockTaskMode()
            }
        } else if (isExamInProgress() && !isExamPaused) {
            collapseNotificationShade()
            applyImmersiveMode()
            window.decorView.postDelayed({
                if (isExamInProgress() && !isExamPaused) {
                    collapseNotificationShade()
                    bringAppToFront()
                }
            }, 150)
        }
    }

    private fun startLockTaskMode() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                val am = getSystemService(Context.ACTIVITY_SERVICE) as? ActivityManager
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    if (am?.lockTaskModeState == ActivityManager.LOCK_TASK_MODE_NONE) {
                        startLockTask()
                    }
                } else {
                    startLockTask()
                }
            }
        } catch (e: Exception) {}
    }

    private fun stopLockTaskMode() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                val am = getSystemService(Context.ACTIVITY_SERVICE) as? ActivityManager
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    if (am?.lockTaskModeState != ActivityManager.LOCK_TASK_MODE_NONE) {
                        stopLockTask()
                    }
                } else {
                    stopLockTask()
                }
            }
        } catch (e: Exception) {}
    }

    private fun bringAppToFront() {
        if (!isExamInProgress() || isExamPaused) return
        try {
            val am = getSystemService(Context.ACTIVITY_SERVICE) as? ActivityManager
            am?.moveTaskToFront(taskId, ActivityManager.MOVE_TASK_WITH_HOME)
        } catch (e: Exception) {}

        try {
            val intent = Intent(this, MainActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_REORDER_TO_FRONT or Intent.FLAG_ACTIVITY_SINGLE_TOP)
            }
            startActivity(intent)
        } catch (e: Exception) {}
    }

    private fun getStatusBarHeight(): Int {
        var result = 0
        val resourceId = resources.getIdentifier("status_bar_height", "dimen", "android")
        if (resourceId > 0) {
            result = resources.getDimensionPixelSize(resourceId)
        }
        return if (result > 0) result else (28 * resources.displayMetrics.density).toInt()
    }

    private fun collapseNotificationShade() {
        try {
            @Suppress("DEPRECATION")
            val closeDialogIntent = Intent(Intent.ACTION_CLOSE_SYSTEM_DIALOGS)
            sendBroadcast(closeDialogIntent)
        } catch (e: Exception) {}

        try {
            @SuppressLint("WrongConstant")
            val statusBarService = getSystemService("statusbar")
            val statusBarManager = Class.forName("android.app.StatusBarManager")
            val collapse = statusBarManager.getMethod("collapsePanels")
            collapse.invoke(statusBarService)
        } catch (e: Exception) {
            try {
                @SuppressLint("WrongConstant")
                val statusBarService = getSystemService("statusbar")
                val statusBarManager = Class.forName("android.app.StatusBarManager")
                val collapse = statusBarManager.getMethod("collapse")
                collapse.invoke(statusBarService)
            } catch (e2: Exception) {}
        }
    }

    override fun dispatchTouchEvent(ev: MotionEvent?): Boolean {
        if (!::webView.isInitialized) return super.dispatchTouchEvent(ev)
        if (ev != null && isExamInProgress() && !isExamPaused) {
            val statusBarHeight = getStatusBarHeight()
            // Intercept zone diperluas agar mencakup notch dan threshold tarikan gesture bilah atas Android
            val interceptZone = Math.max(statusBarHeight + (45 * resources.displayMetrics.density).toInt(), 180)

            when (ev.action) {
                MotionEvent.ACTION_DOWN -> {
                    if (ev.rawY <= interceptZone) {
                        touchStartedInTopZone = true
                        collapseNotificationShade()
                        return true
                    }
                }
                MotionEvent.ACTION_MOVE -> {
                    if (touchStartedInTopZone || ev.rawY <= interceptZone) {
                        collapseNotificationShade()
                        return true
                    }
                }
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                    if (touchStartedInTopZone) {
                        touchStartedInTopZone = false
                        collapseNotificationShade()
                        return true
                    }
                }
            }
        }
        return super.dispatchTouchEvent(ev)
    }

    private fun initViews() {
        // Komponen Web & Error
        webView = findViewById(R.id.webView)
        progressBar = findViewById(R.id.progressBar)
        layoutError = findViewById(R.id.layoutError)
        btnRetry = findViewById(R.id.btnRetry)
        btnSettings = findViewById(R.id.btnSettings)
        btnBackToLandingFromError = findViewById(R.id.btnBackToLandingFromError)
        proctorTrigger = findViewById(R.id.proctorTrigger)

        // Komponen Landing Screen
        layoutLanding = findViewById(R.id.layoutLanding)
        btnEnterExam = findViewById(R.id.btnEnterExam)
        btnCheckUpdateLanding = findViewById(R.id.btnCheckUpdateLanding)
        btnAboutUsLanding = findViewById(R.id.btnAboutUsLanding)
        btnLandingSettings = findViewById(R.id.btnLandingSettings)
        tvLandingServerStatus = findViewById(R.id.tvLandingServerStatus)
        tvLandingVersion = findViewById(R.id.tvLandingVersion)

        // 1. Tombol Masuk Ujian
        btnEnterExam.setOnClickListener {
            layoutLanding.visibility = View.GONE
            webView.visibility = View.VISIBLE
            loadExamUrl()
            applyImmersiveMode()
        }

        // 2. Tombol Cek Update
        btnCheckUpdateLanding.setOnClickListener {
            checkAppUpdate(true)
        }

        // 3. Tombol Tentang Kami
        btnAboutUsLanding.setOnClickListener {
            showAboutDialog()
        }

        // 4. Tombol Pengaturan Server dari Landing Screen
        btnLandingSettings.setOnClickListener {
            promptProctorPinThenShowSettings()
        }

        // Tombol Kembali ke Beranda dari layar error koneksi
        btnBackToLandingFromError.setOnClickListener {
            showLandingScreen()
        }

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

    private fun showLandingScreen() {
        stopPinPolling()
        stopLockTaskMode()
        isExamActive = false
        currentExamExitPin = null
        isExamPaused = false
        currentAttemptId = null
        if (::layoutLanding.isInitialized) layoutLanding.visibility = View.VISIBLE
        if (::webView.isInitialized) webView.visibility = View.GONE
        if (::layoutError.isInitialized) layoutError.visibility = View.GONE
        updateLandingInfo()
        applyImmersiveMode()
    }

    private fun updateLandingInfo() {
        if (!::prefs.isInitialized || !::tvLandingServerStatus.isInitialized || !::tvLandingVersion.isInitialized) return
        val currentStoredUrl = prefs.getString(KEY_EXAM_URL, DEFAULT_URL) ?: DEFAULT_URL
        try {
            val uri = Uri.parse(currentStoredUrl)
            tvLandingServerStatus.text = "🌐 Server: ${uri.host ?: currentStoredUrl}"
        } catch (e: Exception) {
            tvLandingServerStatus.text = "🌐 Server: $currentStoredUrl"
        }
        tvLandingVersion.text = "Madrasah Mandiri Berprestasi • v${BuildConfig.VERSION_NAME}"
    }

    /**
     * Menampilkan dialog Tentang Kami sesuai permintaan user
     */
    private fun showAboutDialog() {
        val view = layoutInflater.inflate(R.layout.dialog_about, null)
        val tvAppName = view.findViewById<TextView>(R.id.tvAboutAppName)
        val tvVersionName = view.findViewById<TextView>(R.id.tvAboutVersionName)
        val tvVersionCode = view.findViewById<TextView>(R.id.tvAboutVersionCode)
        val tvAuthor = view.findViewById<TextView>(R.id.tvAboutAuthor)
        val btnContactAuthor = view.findViewById<MaterialButton>(R.id.btnContactAuthor)
        val btnClose = view.findViewById<MaterialButton>(R.id.btnCloseAbout)

        tvAppName.text = getString(R.string.app_name)
        tvVersionName.text = "v${BuildConfig.VERSION_NAME}"
        tvVersionCode.text = BuildConfig.VERSION_CODE.toString()
        tvAuthor.text = AUTHOR_NAME

        val dialog = AlertDialog.Builder(this)
            .setView(view)
            .setCancelable(true)
            .create()

        btnContactAuthor.setOnClickListener {
            try {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(AUTHOR_WA_LINK))
                startActivity(intent)
            } catch (e: Exception) {
                Toast.makeText(this, "Tidak dapat membuka link WhatsApp", Toast.LENGTH_SHORT).show()
            }
        }

        btnClose.setOnClickListener {
            dialog.dismiss()
            applyImmersiveMode()
        }

        dialog.show()
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
        settings.userAgentString = "${settings.userAgentString} ExambroMadrasah/${BuildConfig.VERSION_NAME}"

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

        webView.addJavascriptInterface(ExambroWebAppInterface(), "ExambroBridge")

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

                if (url?.contains("/login") == true) {
                    webView.clearHistory()
                }

                if (isExamInProgress()) {
                    webView.evaluateJavascript("(function() { return document.querySelector('meta[name=\"exambro-exit-pin\"]')?.getAttribute('content') || window.exambroExitPin || ''; })()") { pin ->
                        val cleanPin = pin?.replace("\"", "")?.trim()
                        if (!cleanPin.isNullOrEmpty() && cleanPin != "null") {
                            currentExamExitPin = cleanPin
                        }
                    }

                    webView.evaluateJavascript("(function() { return document.querySelector('meta[name=\"exambro-paused\"]')?.getAttribute('content') || (window.exambroPaused ? '1' : '0'); })()") { paused ->
                        val cleanPaused = paused?.replace("\"", "")?.trim()
                        val isPaused = cleanPaused == "1" || cleanPaused == "true"
                        isExamPaused = isPaused
                        runOnUiThread {
                            if (isPaused) {
                                stopLockTaskMode()
                                val controller = WindowInsetsControllerCompat(window, window.decorView)
                                controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                            } else {
                                startLockTaskMode()
                                applyImmersiveMode()
                            }
                        }
                    }

                    webView.evaluateJavascript("(function() { return document.querySelector('meta[name=\"exambro-active\"]')?.getAttribute('content') || ''; })()") { active ->
                        val cleanActive = active?.replace("\"", "")?.trim()
                        if (cleanActive == "1" || cleanActive == "true") {
                            isExamActive = true
                            // Ekstrak attemptId dari URL dan mulai polling PIN mandiri
                            val attemptIdMatch = Regex(".*/siswa/ujian/(\\d+).*").find(currentUrl)
                            val extractedId = attemptIdMatch?.groupValues?.getOrNull(1)
                            if (!extractedId.isNullOrEmpty() && (currentAttemptId != extractedId)) {
                                startPinPolling(extractedId)
                            }
                            runOnUiThread {
                                startLockTaskMode()
                                applyImmersiveMode()
                            }
                        }
                    }
                } else {
                    stopPinPolling()
                    stopLockTaskMode()
                    isExamActive = false
                    currentExamExitPin = null
                    isExamPaused = false
                }
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

    inner class ExambroWebAppInterface {
        @android.webkit.JavascriptInterface
        fun setExamActive(active: Boolean, exitPin: String?) {
            // exitPin: PIN dari exams.exit_pin yang dikirim web saat halaman soal dimuat
            if (!exitPin.isNullOrEmpty() && exitPin != "null") {
                currentExamExitPin = exitPin.trim()
            }
            // Ekstrak attemptId dari URL untuk polling PIN mandiri
            val urlStr = webView.url ?: currentUrl
            val attemptIdMatch = Regex(".*/siswa/ujian/(\\d+).*").find(urlStr)
            val extractedAttemptId = attemptIdMatch?.groupValues?.getOrNull(1)

            runOnUiThread {
                isExamActive = active
                if (active) {
                    if (!extractedAttemptId.isNullOrEmpty()) {
                        startPinPolling(extractedAttemptId)
                    }
                    startLockTaskMode()
                } else {
                    stopPinPolling()
                    stopLockTaskMode()
                }
                applyImmersiveMode()
            }
        }

        @android.webkit.JavascriptInterface
        fun setExamExitPin(pin: String?) {
            currentExamExitPin = pin?.trim()
        }

        @android.webkit.JavascriptInterface
        fun setExamPaused(paused: Boolean) {
            isExamPaused = paused
            runOnUiThread {
                if (paused) {
                    // Saat ujian ditahan pengawas:
                    // 1. Hentikan LockTask agar bilah status & navigasi bisa diakses
                    // 2. Izinkan gestur swipe untuk menyalakan/mematikan data/WiFi
                    stopLockTaskMode()
                    try {
                        WindowCompat.setDecorFitsSystemWindows(window, false)
                        val controller = WindowInsetsControllerCompat(window, window.decorView)
                        controller.show(WindowInsetsCompat.Type.systemBars())
                        controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                    } catch (e: Exception) {}
                    Toast.makeText(this@MainActivity, "Ujian dijeda pengawas. Bilah status dibuka untuk mengatur WiFi/Data.", Toast.LENGTH_LONG).show()
                } else {
                    // Saat ujian dilanjutkan kembali: kunci penuh
                    if (isExamInProgress()) {
                        startLockTaskMode()
                    }
                    applyImmersiveMode()
                    Toast.makeText(this@MainActivity, "Ujian dilanjutkan. Mode terkunci diaktifkan kembali.", Toast.LENGTH_SHORT).show()
                }
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
     * Memeriksa apakah siswa sedang berada di dalam halaman pengerjaan soal ujian.
     * Deteksi pelanggaran dan proteksi PIN keluar HANYA aktif saat siswa berada di ruang soal aktif (/siswa/ujian/{attemptId}).
     * TIDAK aktif saat siswa masih berada di halaman input token atau modal konfirmasi (/siswa/ujian).
     */
    private fun isExamInProgress(): Boolean {
        if (isExamActive) return true
        if (!::webView.isInitialized) return false
        val activeUrl = webView.url ?: currentUrl
        if (activeUrl.isEmpty()) return false
        val questionPageRegex = Regex(".*/siswa/ujian/\\d+.*")
        return questionPageRegex.matches(activeUrl)
    }

    // DETEKSI SISWA KELUAR APLIKASI (HOME / RECENT APPS / SPLIT SCREEN)
    override fun onUserLeaveHint() {
        super.onUserLeaveHint()

        // Jangan catat pelanggaran jika:
        // 1. Sedang memunculkan dialog izin kamera sistem
        // 2. Aplikasi baru saja dibuka (< 3 detik)
        // 3. Masih di Beranda awal atau belum masuk ke halaman pengerjaan soal ujian
        if (!::layoutLanding.isInitialized || !::prefs.isInitialized || !::webView.isInitialized) {
            return
        }
        if (isRequestingPermission || !isAppStarted || !isExamInProgress() || layoutLanding.visibility == View.VISIBLE) {
            return
        }

        hasLeftApp = true
        val currentViolations = prefs.getInt(KEY_VIOLATIONS, 0) + 1
        prefs.edit().putInt(KEY_VIOLATIONS, currentViolations).apply()
        bringAppToFront()
    }

    override fun onPause() {
        super.onPause()
        if (!::webView.isInitialized) return
        if (isExamInProgress() && !isExamPaused && !isRequestingPermission) {
            collapseNotificationShade()
            bringAppToFront()
        }
    }

    override fun onStop() {
        super.onStop()
        if (!::webView.isInitialized) return
        if (isExamInProgress() && !isExamPaused && !isRequestingPermission) {
            bringAppToFront()
        }
    }

    override fun onResume() {
        super.onResume()
        if (!::webView.isInitialized || !::prefs.isInitialized) return
        applyImmersiveMode()
        if (isExamInProgress() && !isExamPaused) {
            startLockTaskMode()
        }

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

    // PENANGANAN TOMBOL KEMBALI
    @Suppress("DEPRECATION")
    override fun onBackPressed() {
        if (!::layoutLanding.isInitialized || !::webView.isInitialized || !::prefs.isInitialized) {
            super.onBackPressed()
            return
        }
        val activeUrl = webView.url ?: currentUrl
        val defaultUrl = prefs.getString(KEY_EXAM_URL, DEFAULT_URL) ?: DEFAULT_URL
        val isLoginPage = activeUrl.contains("/login") || activeUrl.endsWith("/login") || activeUrl == defaultUrl

        if (layoutLanding.visibility == View.VISIBLE) {
            // Saat di Beranda Utama: Konfirmasi keluar dari aplikasi
            showNormalExitDialog()
        } else if (isExamInProgress()) {
            // Saat sedang ujian: Tombol kembali DIBLOKIR, butuh PIN Pengawas untuk keluar
            promptProctorPinToExit()
        } else if (isLoginPage || !webView.canGoBack()) {
            // Saat di halaman login (misal setelah keluar akun) atau tidak bisa kembali lagi:
            // Tampilkan pesan konfirmasi apakah ingin kembali ke Beranda
            showReturnToHomeDialog()
        } else {
            webView.goBack()
        }
    }

    private fun showReturnToHomeDialog() {
        AlertDialog.Builder(this)
            .setTitle("Kembali ke Beranda")
            .setMessage("Apakah Anda ingin kembali ke menu Beranda Exambro?")
            .setPositiveButton("Ya, ke Beranda") { _, _ ->
                showLandingScreen()
            }
            .setNeutralButton("Keluar Aplikasi") { _, _ ->
                finish()
            }
            .setNegativeButton("Batal") { dialog, _ ->
                dialog.dismiss()
                applyImmersiveMode()
            }
            .show()
    }

    private fun showNormalExitDialog() {
        AlertDialog.Builder(this)
            .setTitle("Keluar Aplikasi")
            .setMessage("Apakah Anda yakin ingin menutup aplikasi Exambro?")
            .setPositiveButton("Ya, Keluar") { _, _ -> finish() }
            .setNegativeButton("Batal") { dialog, _ ->
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
            .setMessage("Masukkan PIN Keluar Ujian yang tertera pada layar Monitoring Pengawas:")
            .setView(container)
            .setCancelable(false)
            .setPositiveButton(getString(R.string.dialog_btn_exit)) { _, _ ->
                val enteredPin = input.text.toString().trim()
                // Validasi: cek PIN dari server (exam_exit_pin) ATAU master PIN pengawas (SharedPreferences)
                val serverPin = currentExamExitPin?.trim()
                val masterPin = prefs.getString(KEY_PROCTOR_PIN, DEFAULT_PIN) ?: DEFAULT_PIN
                val isValidServerPin = !serverPin.isNullOrEmpty() && enteredPin == serverPin
                val isValidMasterPin = enteredPin == masterPin
                if (isValidServerPin || isValidMasterPin) {
                    stopPinPolling()
                    stopLockTaskMode()
                    isExamActive = false
                    isExamPaused = false
                    showLandingScreen()
                    Toast.makeText(this, "Berhasil keluar dari ujian", Toast.LENGTH_SHORT).show()
                } else {
                    // PIN salah: tampilkan pesan saja.
                    // JANGAN panggil applyImmersiveMode() saat isExamPaused=true agar LockTask tidak diaktifkan lagi.
                    val msg = if (serverPin.isNullOrEmpty())
                        "PIN Keluar Ujian salah! (PIN belum tersinkron — coba tunggu beberapa detik, atau gunakan PIN dari layar Monitoring Pengawas)"
                    else
                        "PIN Keluar Ujian salah! Silakan minta PIN kepada Pengawas Ruang."
                    Toast.makeText(this, msg, Toast.LENGTH_LONG).show()
                    if (!isExamPaused) {
                        applyImmersiveMode()
                    }
                }
            }
            .setNegativeButton(getString(R.string.dialog_btn_cancel)) { dialog, _ ->
                dialog.dismiss()
                if (!isExamPaused) {
                    applyImmersiveMode()
                }
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
        val btnCheckUpdate = view.findViewById<Button>(R.id.btnCheckUpdate)
        val btnReturnLanding = view.findViewById<Button>(R.id.btnReturnLanding)

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

        btnCheckUpdate.setOnClickListener {
            checkAppUpdate(true)
        }

        val settingsDialog = AlertDialog.Builder(this)
            .setView(view)
            .setPositiveButton("Simpan") { _, _ ->
                val newUrl = etUrl.text.toString().trim()
                if (newUrl.isNotEmpty()) {
                    prefs.edit().putString(KEY_EXAM_URL, newUrl).apply()
                    currentUrl = newUrl
                    updateLandingInfo()
                    Toast.makeText(this, "Server disimpan: $newUrl", Toast.LENGTH_SHORT).show()
                }
                applyImmersiveMode()
            }
            .setNegativeButton("Batal") { dialog, _ ->
                dialog.dismiss()
                applyImmersiveMode()
            }
            .create()

        btnReturnLanding.setOnClickListener {
            settingsDialog.dismiss()
            showLandingScreen()
        }

        settingsDialog.show()
    }

    private fun checkAppUpdate(isManual: Boolean) {
        if (isManual) {
            Toast.makeText(this, "Memeriksa pembaruan aplikasi...", Toast.LENGTH_SHORT).show()
        }

        val currentServerUrl = prefs.getString(KEY_EXAM_URL, DEFAULT_URL) ?: DEFAULT_URL
        val endpoint = if (currentServerUrl.endsWith("/")) "${currentServerUrl}api/app-version" else "$currentServerUrl/api/app-version"

        Thread {
            try {
                val url = URL(endpoint)
                val conn = url.openConnection() as HttpURLConnection
                conn.connectTimeout = 6000
                conn.readTimeout = 6000
                conn.requestMethod = "GET"

                if (conn.responseCode == 200) {
                    val reader = BufferedReader(InputStreamReader(conn.inputStream))
                    val response = reader.readText()
                    reader.close()

                    val json = JSONObject(response)
                    val remoteVersionCode = json.optInt("versionCode", 0)
                    val remoteVersionName = json.optString("versionName", "")
                    val downloadUrl = json.optString("downloadUrl", "")
                    val changelog = json.optString("changelog", "Pembaruan performa dan keamanan.")

                    runOnUiThread {
                        if (isFinishing || isDestroyed) return@runOnUiThread
                        if (remoteVersionCode > BuildConfig.VERSION_CODE) {
                            AlertDialog.Builder(this)
                                .setTitle("Pembaruan Tersedia (v$remoteVersionName)")
                                .setMessage("Versi baru aplikasi telah dirilis.\n\nCatatan:\n$changelog\n\nVersi Anda: v${BuildConfig.VERSION_NAME} (Build ${BuildConfig.VERSION_CODE})\nVersi Baru: v$remoteVersionName (Build $remoteVersionCode)\n\nApakah Anda ingin mengunduh pembaruan?")
                                .setCancelable(false)
                                .setPositiveButton("Unduh Pembaruan") { _, _ ->
                                    if (downloadUrl.isNotEmpty()) {
                                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(downloadUrl))
                                        startActivity(intent)
                                    }
                                }
                                .setNegativeButton("Nanti Saja") { dialog, _ ->
                                    dialog.dismiss()
                                    applyImmersiveMode()
                                }
                                .show()
                        } else if (isManual) {
                            AlertDialog.Builder(this)
                                .setTitle("Aplikasi Sudah Versi Terbaru")
                                .setMessage("Aplikasi Anda sudah menggunakan versi resmi terbaru v${BuildConfig.VERSION_NAME} (Build ${BuildConfig.VERSION_CODE}).\nTidak ada pembaruan yang diperlukan.")
                                .setPositiveButton("OK") { dialog, _ ->
                                    dialog.dismiss()
                                    applyImmersiveMode()
                                }
                                .show()
                        }
                    }
                } else if (isManual) {
                    runOnUiThread {
                        Toast.makeText(this, "Tidak dapat memeriksa pembaruan (Status: ${conn.responseCode})", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                if (isManual) {
                    runOnUiThread {
                        Toast.makeText(this, "Gagal terhubung ke server pembaruan", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }.start()
    }
}
