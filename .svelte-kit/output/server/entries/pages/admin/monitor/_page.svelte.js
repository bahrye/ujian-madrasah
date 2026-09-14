import { h as head, k as attr, j as attr_class, e as escape_html, i as ensure_array_like, l as clsx, c as stringify, a as attr_style, f as bind_props } from "../../../../chunks/index.js";
import { p as parseDate } from "../../../../chunks/date.js";
import { o as onDestroy } from "../../../../chunks/index-server.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { A as ATTEMPT_STATUS_COLORS, a as ATTEMPT_STATUS_LABELS, I as ICONS } from "../../../../chunks/constants.js";
import { t as toasts } from "../../../../chunks/toast.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let attempts, filteredAttempts;
    let data = $$props["data"];
    let form = $$props["form"];
    let currentTime = Date.now();
    let isPolling = false;
    onDestroy(() => {
    });
    if (form?.success) toasts.success(form.success);
    if (form?.error) toasts.error(form.error);
    if (data.loadError) toasts.error("Terjadi kesalahan data: " + data.loadError);
    attempts = data.attempts;
    filteredAttempts = attempts;
    if (data.examFilter || data.sessionFilter) ;
    head("1o95ep9", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Monitoring Ujian — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-2xl font-bold text-slate-800">Monitoring Ujian</h1> <p class="text-sm text-slate-500 mt-1">Pantau seluruh siswa yang terdaftar dalam ujian</p></div> <div class="flex items-center gap-2"><button type="button" class="btn-sm btn-ghost border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1.5 text-xs text-slate-700 font-medium shadow-sm transition-colors"${attr("disabled", isPolling, true)} title="Segarkan data monitoring sekarang"><svg${attr_class(`w-3.5 h-3.5 text-slate-600 ${""}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> <span>${escape_html("Segarkan Data")}</span></button> <button type="button" class="btn-sm btn-ghost border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1.5 text-xs text-slate-700 font-medium shadow-sm transition-colors"><svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg> Tes Suara &amp; Panggilan Nama</button></div></div> <div class="card p-4"><form method="GET" class="flex flex-wrap gap-3 mb-4"><select name="exam_id" class="select flex-1 min-w-[200px]" required="">`);
    $$renderer2.option({ value: "" }, ($$renderer3) => {
      $$renderer3.push(`-- Pilih Ujian --`);
    });
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(data.exams);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let exam = each_array[$$index];
      $$renderer2.option(
        {
          value: exam.id,
          selected: String(data.examFilter) === String(exam.id)
        },
        ($$renderer3) => {
          $$renderer3.push(`${escape_html(exam.title)}`);
        }
      );
    }
    $$renderer2.push(`<!--]--></select> `);
    if (data.examFilter && data.availableSessions && data.availableSessions.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<select name="session_number" class="select w-44">`);
      $$renderer2.option({ value: "" }, ($$renderer3) => {
        $$renderer3.push(`Semua Sesi`);
      });
      $$renderer2.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(data.availableSessions);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let sn = each_array_1[$$index_1];
        $$renderer2.option({ value: sn, selected: data.sessionFilter === String(sn) }, ($$renderer3) => {
          $$renderer3.push(`Sesi ${escape_html(sn)}`);
        });
      }
      $$renderer2.push(`<!--]--></select>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <noscript><button type="submit" class="btn-secondary btn-sm">Tampilkan</button></noscript></form> `);
    if (data.examFilter) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex gap-2 overflow-x-auto p-1.5 -m-1.5 mb-1 mt-2"><button${attr_class(`btn-sm ${"btn-primary"}`)}>Semua</button> <button${attr_class(`btn-sm ${"btn-ghost border border-slate-200 text-slate-600"}`)}>Sedang Mengerjakan</button> <button${attr_class(`btn-sm ${"btn-ghost border border-slate-200 text-slate-600"}`)}>Selesai</button> <button${attr_class(`btn-sm ${"btn-ghost border border-slate-200 text-slate-600"}`)}>Belum Mengerjakan</button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="card overflow-hidden">`);
    if (!data.examFilter) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-12 text-center text-slate-400"><svg class="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg> <p class="text-lg font-medium">Silakan pilih ujian terlebih dahulu</p></div>`);
    } else if (filteredAttempts.length === 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="p-12 text-center text-slate-400"><svg class="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.monitor)}></path></svg> <p class="text-lg font-medium">Tidak ada siswa yang sesuai filter</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="table-container border-0 rounded-none"><table class="table"><thead><tr><th>Siswa</th><th>Username</th><th>Status</th><th class="w-20 text-center">TTD</th><th class="w-24 text-center">Pelanggaran</th><th class="w-32">Progress</th><th>Sisa Waktu</th><th class="text-right">Aksi</th></tr></thead><tbody><!--[-->`);
      const each_array_2 = ensure_array_like(filteredAttempts);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let a = each_array_2[$$index_2];
        $$renderer2.push(`<tr><td class="font-semibold text-slate-800"><div>${escape_html(a.student_name)}</div> <span class="inline-block px-1.5 py-0.5 mt-0.5 text-[10px] font-semibold text-indigo-700 bg-indigo-50 rounded border border-indigo-100">Sesi ${escape_html(a.student_session_number || 1)}</span></td><td class="text-slate-500">@${escape_html(a.username)}</td><td><div class="flex flex-col gap-1 items-start"><span${attr_class(clsx(ATTEMPT_STATUS_COLORS[a.status] || "badge-secondary"))}>`);
        if (a.status === "mengerjakan") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse mr-1"></span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> ${escape_html(ATTEMPT_STATUS_LABELS[a.status] || "Belum Mengerjakan")}</span> `);
        if (a.is_paused) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge bg-amber-100 text-amber-700 text-[10px] font-bold tracking-wide">DITAHAN</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></td><td class="text-center">`);
        if (a.signature) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<button type="button" class="group relative inline-flex items-center justify-center p-1 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer" title="Klik untuk memperbesar tanda tangan"><img${attr("src", a.signature)}${attr("alt", `TTD ${stringify(a.student_name)}`)} class="h-7 max-w-[55px] object-contain"/> <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-600 text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity">🔍</span></button>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="text-slate-300 text-xs">-</span>`);
        }
        $$renderer2.push(`<!--]--></td><td class="text-center">`);
        if (a.status === "belum_mengerjakan") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-slate-400 text-xs">-</span>`);
        } else if (a.warnings > 0) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<div class="flex items-center justify-center gap-1"><span class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-xs">${escape_html(a.warnings)} kali</span> `);
          if (a.warningLogs && a.warningLogs.length > 0) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<button class="btn-ghost btn-sm p-1 rounded-full text-slate-400 hover:text-slate-600" aria-label="Lihat Log Pelanggaran" title="Lihat Log Pelanggaran"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></button>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="text-slate-400 text-xs">-</span>`);
        }
        $$renderer2.push(`<!--]--></td><td class="w-32">`);
        if (a.status === "belum_mengerjakan") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-xs text-slate-400">0%</span>`);
        } else if (a.question_count > 0) {
          $$renderer2.push("<!--[1-->");
          const pct = Math.round(a.answeredCount / a.question_count * 100);
          const color = pct < 30 ? "bg-slate-300" : pct < 60 ? "bg-rose-400" : pct < 90 ? "bg-amber-400" : "bg-emerald-500";
          $$renderer2.push(`<div class="flex items-center gap-2"><div class="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden"><div${attr_class(`h-full ${color} transition-all duration-500`)}${attr_style(`width: ${stringify(pct)}%`)}></div></div> <span class="text-xs font-semibold text-slate-600 w-8 text-right">${escape_html(pct)}%</span></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="text-xs text-slate-400">0%</span>`);
        }
        $$renderer2.push(`<!--]--></td><td class="text-xs">`);
        if (a.status === "belum_mengerjakan" || !a.end_time) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-slate-400 font-medium opacity-80">-</span>`);
        } else if (a.status === "mengerjakan") {
          $$renderer2.push("<!--[1-->");
          const endStr = a.end_time ? a.end_time.replace(" ", "T") + (a.end_time.includes(" ") && !a.end_time.includes("Z") ? "Z" : "") : "";
          const end = endStr ? parseDate(endStr).getTime() : 0;
          const compareTime = a.is_paused && a.paused_at ? parseDate(a.paused_at).getTime() : currentTime;
          const remainingMs = end > 0 ? end - compareTime : 0;
          if (end > 0 && remainingMs > 0) {
            $$renderer2.push("<!--[0-->");
            const totalM = Math.floor(remainingMs / 6e4);
            const h = Math.floor(totalM / 60);
            const m = totalM % 60;
            $$renderer2.push(`<span class="text-slate-600 font-medium">`);
            if (h > 0) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`${escape_html(h)} jam`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]-->${escape_html(m)} mnt</span>`);
          } else if (end > 0) {
            $$renderer2.push("<!--[1-->");
            $$renderer2.push(`<span class="text-rose-500 font-bold">Habis</span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span class="text-slate-400 font-medium opacity-80">-</span>`);
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[-1-->");
          const endStr = a.end_time ? a.end_time.replace(" ", "T") + (a.end_time.includes(" ") && !a.end_time.includes("Z") ? "Z" : "") : "";
          const submitStr = a.submit_time ? a.submit_time.replace(" ", "T") + (a.submit_time.includes(" ") && !a.submit_time.includes("Z") ? "Z" : "") : endStr;
          const end = endStr ? parseDate(endStr).getTime() : 0;
          const submit = submitStr ? parseDate(submitStr).getTime() : 0;
          const remainingMs = end > 0 && submit > 0 ? end - submit : 0;
          if (end > 0 && remainingMs > 0) {
            $$renderer2.push("<!--[0-->");
            const totalM = Math.floor(remainingMs / 6e4);
            const h = Math.floor(totalM / 60);
            const m = totalM % 60;
            $$renderer2.push(`<span class="text-slate-500 font-medium" title="Sisa Waktu Saat Selesai">`);
            if (h > 0) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`${escape_html(h)} jam`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]-->${escape_html(m)} mnt</span>`);
          } else if (end > 0) {
            $$renderer2.push("<!--[1-->");
            $$renderer2.push(`<span class="text-slate-400 font-medium opacity-80">Habis</span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span class="text-slate-400 font-medium opacity-80">-</span>`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></td><td class="text-right">`);
        if (a.status === "mengerjakan") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="flex items-center justify-end gap-2"><form method="POST" action="?/togglePause"><input type="hidden" name="attempt_id"${attr("value", a.attempt_id)}/> `);
          if (a.is_paused) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<input type="hidden" name="action" value="resume"/> <button type="submit" class="btn-sm btn-success" title="Lanjutkan Ujian"><svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Lanjutkan</button>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<input type="hidden" name="action" value="pause"/> <button type="submit" class="btn-sm btn-warning text-white" title="Tahan Sementara"><svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Tahan</button>`);
          }
          $$renderer2.push(`<!--]--></form> <button class="btn-sm btn-danger"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.refresh)}></path></svg> Reset</button></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="text-slate-300">-</span>`);
        }
        $$renderer2.push(`<!--]--></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
