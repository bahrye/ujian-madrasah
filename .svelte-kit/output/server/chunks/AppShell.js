import { m as fallback, e as escape_html, k as attr, f as bind_props, s as store_get, u as unsubscribe_stores, i as ensure_array_like, j as attr_class, c as stringify, d as slot } from "./index.js";
import { p as page } from "./stores.js";
import { R as ROLE_LABELS, I as ICONS } from "./constants.js";
import "./toast.js";
import { g as generateStudentQrData, a as getQrCodeImageUrl } from "./qrLogin.js";
import "@sveltejs/kit/internal";
import "./exports.js";
import "./utils2.js";
import "@sveltejs/kit/internal/server";
import "./root.js";
import "./state.svelte.js";
import { T as Toast } from "./Toast2.js";
function MyQrLoginModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let qrPayload, qrImageUrl;
    let show = fallback($$props["show"], false);
    let user = fallback($$props["user"], null);
    let schoolName = fallback($$props["schoolName"], "");
    let includePassword = false;
    qrPayload = generateStudentQrData(user?.username || "", "");
    qrImageUrl = getQrCodeImageUrl(qrPayload, 250);
    if (show && user) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4"><div class="fixed inset-0 bg-slate-950/75 backdrop-blur-sm" role="button" tabindex="-1" aria-label="Tutup"></div> <div class="bg-white text-slate-800 w-full max-w-sm rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col animate-bounce-in"><div class="p-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-center relative overflow-hidden"><div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div> <button class="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors" aria-label="Tutup"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button> <div class="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 mx-auto flex items-center justify-center mb-2 shadow-inner"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg></div> <h3 class="text-base font-bold">QR Akses Login Saya</h3> <span class="inline-block px-2.5 py-0.5 mt-1 bg-white/20 text-white rounded-full text-[11px] font-semibold uppercase tracking-wider">${escape_html(ROLE_LABELS[user.role || ""] || user.role)}</span></div> <div class="p-6 flex flex-col items-center text-center space-y-4"><div class="p-3 bg-slate-50 border-2 border-dashed border-indigo-200 rounded-2xl shadow-inner relative group"><img${attr("src", qrImageUrl)} alt="QR Code Login" class="w-48 h-48 rounded-xl object-contain bg-white"/></div> <div class="w-full"><p class="font-bold text-base text-slate-800 leading-tight">${escape_html(user.name)}</p> <p class="text-xs font-mono font-semibold text-slate-500 mt-1">Username: ${escape_html(user.username)}</p></div> <div class="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-left text-xs"><label class="flex items-center gap-2 cursor-pointer font-medium text-slate-700 select-none"><input type="checkbox"${attr("checked", includePassword, true)} class="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"/> <span>Sertakan kata sandi di QR (Login Langsung)</span></label> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <p class="text-[11px] text-slate-500 leading-snug">Tunjukkan QR ini ke kamera komputer madrasah di halaman login untuk masuk secara otomatis.</p></div> <div class="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2"><button type="button" class="btn btn-secondary flex-1 text-xs py-2">Tutup</button> <button type="button" class="btn btn-primary flex-1 text-xs py-2 gap-1.5 shadow-md shadow-indigo-500/20"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak / Unduh Badge</button></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { show, user, schoolName });
  });
}
function Sidebar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let currentPath;
    let menuItems = fallback($$props["menuItems"], () => [], true);
    let user = $$props["user"];
    let isOpen = fallback($$props["isOpen"], false);
    let showMyQrModal = false;
    function isActive(href, path) {
      if (!href) return false;
      const roleRoute = user?.role === "panitia" ? "/admin" : `/${user?.role}`;
      if (href === roleRoute) {
        return path === href;
      }
      return path.startsWith(href);
    }
    function isGroupActive(item, path) {
      if (item.href && isActive(item.href, path)) return true;
      if (item.subItems) {
        return item.subItems.some((sub) => isActive(sub.href, path));
      }
      return false;
    }
    let openDropdowns = {};
    const roleGradients = {
      admin: "from-rose-500 to-pink-500",
      guru: "from-indigo-500 to-violet-500",
      pengawas: "from-amber-500 to-orange-500",
      siswa: "from-cyan-500 to-sky-500"
    };
    currentPath = store_get($$store_subs ??= {}, "$page", page).url.pathname;
    {
      menuItems.forEach((item) => {
        if (item.subItems && isGroupActive(item, currentPath)) {
          openDropdowns[item.label] = true;
        }
      });
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<aside class="hidden lg:flex flex-col w-64 h-screen bg-gradient-to-b from-primary-950 to-primary-900 text-white border-r border-primary-800/50 fixed left-0 top-0 z-40"><div class="p-6 border-b border-primary-800/50"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center shadow-lg shadow-indigo-500/30"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div> <div><h1 class="text-base font-bold tracking-tight">Ujian Madrasah</h1> <p class="text-xs text-primary-300">Sistem Ujian Online</p></div></div></div> <nav class="flex-1 p-4 space-y-1 overflow-y-auto"><!--[-->`);
      const each_array = ensure_array_like(menuItems);
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let item = each_array[$$index_1];
        if (item.subItems) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="space-y-1"><button${attr_class(`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isGroupActive(item, currentPath) ? "bg-white/10 text-white shadow-lg shadow-white/5" : "text-primary-300 hover:text-white hover:bg-white/5"}`)}><div class="flex items-center gap-3"><svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS[item.icon] || "")}></path></svg> <span>${escape_html(item.label)}</span></div> <svg${attr_class(`w-4 h-4 transition-transform duration-200 ${openDropdowns[item.label] ? "rotate-180" : ""}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronDown)}></path></svg></button> `);
          if (openDropdowns[item.label]) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="pl-12 pr-4 py-1 space-y-1 animate-in slide-in-from-top-2 fade-in duration-200"><!--[-->`);
            const each_array_1 = ensure_array_like(item.subItems);
            for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
              let subItem = each_array_1[$$index];
              $$renderer3.push(`<a${attr("href", subItem.href)}${attr_class(`block px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${isActive(subItem.href, currentPath) ? "text-white bg-white/10 font-semibold" : "text-primary-300/80 hover:text-white hover:bg-white/5"}`)}>${escape_html(subItem.label)}</a>`);
            }
            $$renderer3.push(`<!--]--></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<a${attr("href", item.href)}${attr_class(`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(item.href, currentPath) ? "bg-white/15 text-white shadow-lg shadow-white/5" : "text-primary-300 hover:text-white hover:bg-white/10"}`)}><svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS[item.icon] || "")}></path></svg> <span>${escape_html(item.label)}</span> `);
          if (isActive(item.href, currentPath)) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-lg shadow-white/50"></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></a>`);
        }
        $$renderer3.push(`<!--]-->`);
      }
      $$renderer3.push(`<!--]--></nav> <div class="p-4 border-t border-primary-800/50"><div class="flex items-center gap-3 px-3 py-2">`);
      if (user?.role === "admin" || user?.role === "panitia") {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<button class="flex-1 flex items-center gap-3 min-w-0 hover:bg-white/10 p-1.5 -ml-1.5 rounded-xl transition-colors text-left" title="Edit Profil"><div${attr_class(`w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br ${stringify(roleGradients[user?.role ?? "siswa"])} flex items-center justify-center text-sm font-bold shadow-lg overflow-hidden`)}>`);
        if (user?.photo) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<img${attr("src", user.photo)}${attr("alt", user.name)} class="w-full h-full object-cover"/>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`${escape_html(user?.name?.charAt(0).toUpperCase() ?? "?")}`);
        }
        $$renderer3.push(`<!--]--></div> <div class="flex-1 min-w-0"><p class="text-sm font-semibold truncate group-hover:text-white">${escape_html(user?.name ?? "Pengguna")}</p> <div class="flex items-center gap-1 text-xs text-primary-400"><span>${escape_html(ROLE_LABELS[user?.role ?? ""] ?? "")}</span> <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.edit)}></path></svg></div></div></button>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<div${attr_class(`w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br ${stringify(roleGradients[user?.role ?? "siswa"])} flex items-center justify-center text-sm font-bold shadow-lg overflow-hidden`)}>`);
        if (user?.photo) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<img${attr("src", user.photo)}${attr("alt", user.name)} class="w-full h-full object-cover"/>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`${escape_html(user?.name?.charAt(0).toUpperCase() ?? "?")}`);
        }
        $$renderer3.push(`<!--]--></div> <div class="flex-1 min-w-0"><p class="text-sm font-semibold truncate">${escape_html(user?.name ?? "Pengguna")}</p> <div class="flex flex-col gap-0.5 mt-0.5">`);
        if (user?.role === "siswa") {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<p class="text-[11px] text-primary-300 font-mono leading-none">${escape_html(user?.username)}</p>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> <p class="text-xs text-primary-400 leading-none">${escape_html(ROLE_LABELS[user?.role ?? ""] ?? "")}</p></div></div>`);
      }
      $$renderer3.push(`<!--]--> <a href="/api/logout" class="p-1.5 rounded-lg text-primary-400 hover:text-white hover:bg-white/10 transition-colors" title="Keluar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.logout)}></path></svg></a></div></div></aside> `);
      if (isOpen) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"><aside class="w-72 h-full bg-gradient-to-b from-primary-950 to-primary-900 text-white shadow-2xl flex flex-col"><div class="p-5 border-b border-primary-800/50 flex items-center justify-between"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center shadow-lg shadow-indigo-500/30"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div> <span class="text-base font-bold">Ujian Madrasah</span></div> <button class="p-1.5 rounded-lg hover:bg-white/10 transition-colors" aria-label="Tutup menu"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.close)}></path></svg></button></div> <nav class="flex-1 p-4 space-y-1 overflow-y-auto"><!--[-->`);
        const each_array_2 = ensure_array_like(menuItems);
        for (let $$index_3 = 0, $$length = each_array_2.length; $$index_3 < $$length; $$index_3++) {
          let item = each_array_2[$$index_3];
          if (item.subItems) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="space-y-1"><button${attr_class(`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isGroupActive(item, currentPath) ? "bg-white/10 text-white" : "text-primary-300 hover:text-white hover:bg-white/5"}`)}><div class="flex items-center gap-3"><svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS[item.icon] || "")}></path></svg> <span>${escape_html(item.label)}</span></div> <svg${attr_class(`w-4 h-4 transition-transform duration-200 ${openDropdowns[item.label] ? "rotate-180" : ""}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronDown)}></path></svg></button> `);
            if (openDropdowns[item.label]) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<div class="pl-12 pr-4 py-1 space-y-1 animate-in slide-in-from-top-2 fade-in duration-200"><!--[-->`);
              const each_array_3 = ensure_array_like(item.subItems);
              for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
                let subItem = each_array_3[$$index_2];
                $$renderer3.push(`<a${attr("href", subItem.href)}${attr_class(`block px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 ${isActive(subItem.href, currentPath) ? "text-white bg-white/10 font-semibold" : "text-primary-300/80 hover:text-white hover:bg-white/5"}`)}>${escape_html(subItem.label)}</a>`);
              }
              $$renderer3.push(`<!--]--></div>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<a${attr("href", item.href)}${attr_class(`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(item.href, currentPath) ? "bg-white/15 text-white" : "text-primary-300 hover:text-white hover:bg-white/10"}`)}><svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS[item.icon] || "")}></path></svg> <span>${escape_html(item.label)}</span></a>`);
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--></nav> <div class="p-4 border-t border-primary-800/50"><div class="flex items-center gap-3 px-3 py-2">`);
        if (user?.role === "admin" || user?.role === "panitia") {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<button class="flex-1 flex items-center gap-3 min-w-0 hover:bg-white/10 p-1.5 -ml-1.5 rounded-xl transition-colors text-left" title="Edit Profil"><div${attr_class(`w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br ${stringify(roleGradients[user?.role ?? "siswa"])} flex items-center justify-center text-sm font-bold overflow-hidden`)}>`);
          if (user?.photo) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<img${attr("src", user.photo)}${attr("alt", user.name)} class="w-full h-full object-cover"/>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`${escape_html(user?.name?.charAt(0).toUpperCase() ?? "?")}`);
          }
          $$renderer3.push(`<!--]--></div> <div class="flex-1 min-w-0"><p class="text-sm font-semibold truncate">${escape_html(user?.name ?? "Pengguna")}</p> <div class="flex items-center gap-1 text-xs text-primary-400"><span>${escape_html(ROLE_LABELS[user?.role ?? ""] ?? "")}</span> <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.edit)}></path></svg></div></div></button>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<div${attr_class(`w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br ${stringify(roleGradients[user?.role ?? "siswa"])} flex items-center justify-center text-sm font-bold overflow-hidden`)}>`);
          if (user?.photo) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<img${attr("src", user.photo)}${attr("alt", user.name)} class="w-full h-full object-cover"/>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`${escape_html(user?.name?.charAt(0).toUpperCase() ?? "?")}`);
          }
          $$renderer3.push(`<!--]--></div> <div class="flex-1 min-w-0"><p class="text-sm font-semibold truncate">${escape_html(user?.name ?? "Pengguna")}</p> <div class="flex flex-col gap-0.5 mt-0.5">`);
          if (user?.role === "siswa") {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<p class="text-[11px] text-primary-300 font-mono leading-none">${escape_html(user?.username)}</p>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> <p class="text-xs text-primary-400 leading-none">${escape_html(ROLE_LABELS[user?.role ?? ""] ?? "")}</p></div></div>`);
        }
        $$renderer3.push(`<!--]--> <div class="mt-2 flex flex-col gap-1"><button type="button" class="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-primary-200 hover:text-white hover:bg-white/10 transition-colors"><svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg> QR Akses Saya</button> <a href="/api/logout" class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-primary-300 hover:text-white hover:bg-white/10 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.logout)}></path></svg> Keluar</a></div></div></div></aside></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      MyQrLoginModal($$renderer3, { show: showMyQrModal, user });
      $$renderer3.push(`<!----> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { menuItems, user, isOpen });
  });
}
function Navbar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let user = $$props["user"];
    let userInfo = fallback($$props["userInfo"], null);
    let showMyQrModal = false;
    const roleGradients = {
      admin: "from-rose-500 to-pink-500",
      guru: "from-indigo-500 to-violet-500",
      pengawas: "from-amber-500 to-orange-500",
      siswa: "from-cyan-500 to-sky-500"
    };
    $$renderer2.push(`<header class="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4 py-3"><div class="flex items-center justify-between"><div class="flex items-center gap-3"><button class="p-2 -ml-1 rounded-xl hover:bg-slate-100 transition-colors" aria-label="Buka menu"><svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.menu)}></path></svg></button> <div class="flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20"><svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div> <span class="font-bold text-sm text-slate-800">Ujian Madrasah</span></div></div> <div class="flex items-center gap-2 relative"><span class="text-xs font-medium text-slate-500 hidden sm:block">${escape_html(ROLE_LABELS[user?.role ?? ""] ?? "")}</span> <button${attr_class(`w-8 h-8 rounded-full bg-gradient-to-br ${stringify(roleGradients[user?.role ?? "siswa"])} flex items-center justify-center text-xs font-bold text-white shadow-md hover:ring-2 ring-offset-1 ring-indigo-500 transition-all focus:outline-none overflow-hidden`)} aria-label="Toggle profile menu">`);
    if (user?.photo) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<img${attr("src", user.photo)}${attr("alt", user.name)} class="w-full h-full object-cover"/>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html(user?.name?.charAt(0).toUpperCase() ?? "?")}`);
    }
    $$renderer2.push(`<!--]--></button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div></header> `);
    MyQrLoginModal($$renderer2, {
      show: showMyQrModal,
      user,
      schoolName: userInfo?.school_name || ""
    });
    $$renderer2.push(`<!---->`);
    bind_props($$props, { user, userInfo });
  });
}
function AppShell($$renderer, $$props) {
  let user = $$props["user"];
  let userInfo = fallback($$props["userInfo"], null);
  let menuItems = fallback($$props["menuItems"], () => [], true);
  let sidebarOpen = false;
  let $$settled = true;
  let $$inner_renderer;
  function $$render_inner($$renderer2) {
    $$renderer2.push(`<div class="min-h-screen bg-slate-50">`);
    Sidebar($$renderer2, {
      menuItems,
      user,
      get isOpen() {
        return sidebarOpen;
      },
      set isOpen($$value) {
        sidebarOpen = $$value;
        $$settled = false;
      }
    });
    $$renderer2.push(`<!----> `);
    Navbar($$renderer2, { user, userInfo });
    $$renderer2.push(`<!----> <main class="lg:ml-64 min-h-screen"><div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></div></main> `);
    Toast($$renderer2);
    $$renderer2.push(`<!----></div>`);
  }
  do {
    $$settled = true;
    $$inner_renderer = $$renderer.copy();
    $$render_inner($$inner_renderer);
  } while (!$$settled);
  $$renderer.subsume($$inner_renderer);
  bind_props($$props, { user, userInfo, menuItems });
}
export {
  AppShell as A
};
