import { m as fallback, k as attr, i as ensure_array_like, e as escape_html, j as attr_class, f as bind_props, h as head } from "../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { T as Toast } from "../../../chunks/Toast2.js";
import { P as PasswordInput } from "../../../chunks/PasswordInput.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
import { Html5Qrcode } from "html5-qrcode";
import { p as parseQrLoginData } from "../../../chunks/qrLogin.js";
function QrScannerModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let show = fallback($$props["show"], false);
    let scannerContainerId = "qr-reader-" + Math.random().toString(36).substring(2, 9);
    let html5QrCode = null;
    let isScanning = false;
    let cameras = [];
    let selectedCameraId = "";
    let errorMessage = "";
    let isProcessing = false;
    let hasTorch = false;
    let isStarting = false;
    function playSuccessBeep() {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch (err) {
        console.debug("Audio feedback not available:", err);
      }
    }
    async function getCameras() {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          cameras = devices;
          const backCam = devices.find((d) => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("rear") || d.label.toLowerCase().includes("environment"));
          selectedCameraId = backCam ? backCam.id : devices[0].id;
        }
      } catch (err) {
        console.warn("Unable to list cameras:", err);
      }
    }
    async function startScanner() {
      if (isScanning || isStarting) return;
      isStarting = true;
      errorMessage = "";
      try {
        if (!html5QrCode) {
          html5QrCode = new Html5Qrcode(scannerContainerId);
        }
        if (cameras.length === 0) {
          await getCameras();
        }
        const cameraConfig = selectedCameraId ? { deviceId: { exact: selectedCameraId } } : { facingMode: "environment" };
        const config = {
          fps: 15,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const size = Math.floor(minEdge * 0.72);
            return { width: size, height: size };
          },
          aspectRatio: 1
        };
        await html5QrCode.start(cameraConfig, config, onScanSuccess, onScanFailure);
        isScanning = true;
        try {
          const capabilities = html5QrCode.getRunningTrackCapabilities();
          hasTorch = Boolean(capabilities && capabilities.torch);
        } catch {
          hasTorch = false;
        }
      } catch (err) {
        console.error("Start scanner error:", err);
        errorMessage = err?.message || "Gagal mengakses kamera. Pastikan izin kamera telah diberikan.";
        isScanning = false;
      } finally {
        isStarting = false;
      }
    }
    async function stopScanner() {
      if (html5QrCode && isScanning) {
        try {
          await html5QrCode.stop();
        } catch (err) {
          console.debug("Stop scanner error:", err);
        }
        isScanning = false;
      }
    }
    function onScanSuccess(decodedText) {
      if (isProcessing) return;
      const parsed = parseQrLoginData(decodedText);
      if (parsed && parsed.username) {
        isProcessing = true;
        playSuccessBeep();
        stopScanner();
      } else {
        errorMessage = "Format QR Code tidak dikenali sebagai kode login ujian.";
        setTimeout(
          () => {
            if (errorMessage.includes("Format QR Code")) {
              errorMessage = "";
            }
          },
          4e3
        );
      }
    }
    function onScanFailure(_error) {
    }
    onDestroy(() => {
      stopScanner();
      if (html5QrCode) {
        try {
          html5QrCode.clear();
        } catch {
        }
      }
    });
    if (show) {
      setTimeout(
        () => {
          startScanner();
        },
        100
      );
    } else {
      stopScanner();
    }
    if (show) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 svelte-6d2txn"><div class="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fade-in svelte-6d2txn" role="button" tabindex="-1" aria-label="Tutup pemindai QR"></div> <div class="bg-slate-900 text-white w-full max-w-md rounded-3xl shadow-2xl shadow-indigo-950/50 border border-slate-700/60 relative z-10 flex flex-col max-h-[92vh] overflow-hidden qr-modal-anim svelte-6d2txn"><div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur svelte-6d2txn"><div class="flex items-center gap-3 svelte-6d2txn"><div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white svelte-6d2txn"><svg class="w-5 h-5 svelte-6d2txn" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" class="svelte-6d2txn"></path></svg></div> <div class="svelte-6d2txn"><h2 class="text-base font-bold text-white leading-tight svelte-6d2txn">Scan QR Kartu Ujian</h2> <p class="text-xs text-slate-400 svelte-6d2txn">Arahkan kamera ke QR kartu ujian Anda</p></div></div> <button class="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-colors svelte-6d2txn" aria-label="Tutup"><svg class="w-5 h-5 svelte-6d2txn" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" class="svelte-6d2txn"></path></svg></button></div> <div class="p-6 flex-1 flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden svelte-6d2txn"><div class="relative w-full aspect-square max-w-[320px] rounded-2xl overflow-hidden bg-black border-2 border-indigo-500/40 shadow-inner flex items-center justify-center svelte-6d2txn"><div${attr("id", scannerContainerId)} class="w-full h-full object-cover svelte-6d2txn"></div> <div class="absolute inset-0 pointer-events-none flex items-center justify-center svelte-6d2txn"><div class="relative w-3/4 h-3/4 border-2 border-dashed border-indigo-400/50 rounded-2xl overflow-hidden svelte-6d2txn"><div class="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg svelte-6d2txn"></div> <div class="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg svelte-6d2txn"></div> <div class="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg svelte-6d2txn"></div> <div class="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-indigo-400 rounded-br-lg svelte-6d2txn"></div> `);
      if (isScanning && !isProcessing) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="scan-laser absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] svelte-6d2txn"></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div> `);
      if (isStarting) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-3 text-slate-300 svelte-6d2txn"><svg class="w-8 h-8 animate-spin text-indigo-400 svelte-6d2txn" fill="none" viewBox="0 0 24 24"><circle class="opacity-25 svelte-6d2txn" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75 svelte-6d2txn" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> <p class="text-xs font-medium tracking-wide svelte-6d2txn">Menyiapkan kamera...</p></div>`);
      } else if (isProcessing) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<div class="absolute inset-0 bg-indigo-950/90 flex flex-col items-center justify-center gap-3 text-white svelte-6d2txn"><div class="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center svelte-6d2txn"><svg class="w-6 h-6 text-emerald-400 animate-bounce svelte-6d2txn" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" class="svelte-6d2txn"></path></svg></div> <p class="text-sm font-bold text-emerald-300 svelte-6d2txn">QR Terdeteksi! Memproses login...</p></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (errorMessage) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs font-medium flex items-center gap-2 max-w-sm text-center svelte-6d2txn"><svg class="w-4 h-4 text-rose-400 flex-shrink-0 svelte-6d2txn" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" class="svelte-6d2txn"></path></svg> <span class="flex-1 svelte-6d2txn">${escape_html(errorMessage)}</span></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="mt-4 flex items-center justify-center gap-2 flex-wrap w-full max-w-sm svelte-6d2txn">`);
      if (cameras.length > 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="relative flex-1 min-w-[140px] svelte-6d2txn">`);
        $$renderer2.select(
          {
            class: "w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none",
            value: selectedCameraId
          },
          ($$renderer3) => {
            $$renderer3.push(`<!--[-->`);
            const each_array = ensure_array_like(cameras);
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let cam = each_array[$$index];
              $$renderer3.option(
                { value: cam.id, class: "" },
                ($$renderer4) => {
                  $$renderer4.push(`${escape_html(cam.label || `Kamera ${cam.id.slice(0, 5)}`)}`);
                },
                "svelte-6d2txn"
              );
            }
            $$renderer3.push(`<!--]-->`);
          },
          "svelte-6d2txn"
        );
        $$renderer2.push(`</div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (hasTorch) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button type="button"${attr_class(
          `p-2 rounded-xl border transition-colors ${"bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"}`,
          "svelte-6d2txn"
        )} title="Senter"><svg class="w-4 h-4 svelte-6d2txn" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" class="svelte-6d2txn"></path></svg></button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <input type="file" accept="image/*" class="hidden svelte-6d2txn"/> <button type="button" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors svelte-6d2txn"><svg class="w-4 h-4 text-indigo-400 svelte-6d2txn" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" class="svelte-6d2txn"></path></svg> Unggah Foto QR</button></div></div> <div class="px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400 svelte-6d2txn"><div class="flex items-center gap-1.5 svelte-6d2txn"><span${attr_class(`w-2 h-2 rounded-full ${isScanning ? "bg-emerald-500 animate-pulse" : "bg-slate-500"}`, "svelte-6d2txn")}></span> <span class="svelte-6d2txn">${escape_html(isScanning ? "Kamera aktif" : "Kamera nonaktif")}</span></div> <button type="button" class="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors svelte-6d2txn">Batal</button></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { show });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let form = $$props["form"];
    let loading = false;
    let showQrModal = false;
    let username = "";
    let password = "";
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1x05zx6", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Masuk — Ujian Online Madrasah</title>`);
        });
      });
      Toast($$renderer3);
      $$renderer3.push(`<!----> `);
      QrScannerModal($$renderer3, { show: showQrModal });
      $$renderer3.push(`<!----> <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-950 via-primary-900 to-violet-900 relative overflow-hidden"><div class="absolute inset-0 overflow-hidden pointer-events-none"><div class="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div> <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"></div> <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl"></div></div> <div class="w-full max-w-md relative z-10 animate-bounce-in"><div class="card-glass p-8 sm:p-10"><div class="text-center mb-8"><div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-xl shadow-indigo-500/30 mb-4"><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div> <h1 class="text-2xl font-bold text-slate-800">Ujian Online Madrasah</h1> <p class="text-sm text-slate-500 mt-1">Masuk ke akun Anda untuk melanjutkan</p></div> `);
      if (form?.error) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium flex items-center gap-2"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> ${escape_html(form.error)}</div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <form method="POST" class="space-y-4"><div><label for="username" class="label">Username</label> <div class="relative"><svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> <input id="username" name="username" type="text" required=""${attr("value", username)} class="input pl-10" placeholder="Masukkan username" autocomplete="username"/></div></div> <div><label for="password" class="label">Kata Sandi</label> `);
      PasswordInput($$renderer3, {
        id: "password",
        name: "password",
        required: true,
        iconLeft: true,
        placeholder: "Masukkan kata sandi",
        autocomplete: "current-password",
        get value() {
          return password;
        },
        set value($$value) {
          password = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <button type="submit"${attr("disabled", loading, true)} class="btn-primary w-full justify-center py-3 text-base shadow-lg shadow-indigo-600/20">`);
      {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`Masuk`);
      }
      $$renderer3.push(`<!--]--></button> <div class="relative flex items-center justify-center my-3"><div class="border-t border-slate-200 w-full"></div> <span class="bg-white/80 px-3 text-xs text-slate-400 font-medium uppercase tracking-wider absolute">atau</span></div> <button type="button"${attr("disabled", loading, true)} class="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border-2 border-indigo-200/80 hover:border-indigo-500 bg-indigo-50/60 hover:bg-indigo-50 text-indigo-700 font-semibold text-sm transition-all duration-200 hover:shadow-md hover:shadow-indigo-100 active:scale-[0.99] group"><div class="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg></div> <span>Login dengan Kode QR</span></button></form></div> <p class="text-center text-xs text-primary-300/60 mt-6">© 2024 Ujian Online Madrasah. Seluruh hak dilindungi.</p></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { form });
  });
}
export {
  _page as default
};
