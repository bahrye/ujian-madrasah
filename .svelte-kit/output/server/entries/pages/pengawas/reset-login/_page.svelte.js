import { h as head, k as attr, e as escape_html, i as ensure_array_like, f as bind_props } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { S as StatCard } from "../../../../chunks/StatCard.js";
import { I as ICONS } from "../../../../chunks/constants.js";
import { p as parseDate } from "../../../../chunks/date.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let form = $$props["form"];
    let searchQuery = data.filters.q || "";
    let selectedExam = data.filters.exam_id || "";
    let selectedSession = data.filters.session_number || "";
    function formatTime(timeStr) {
      if (!timeStr) return "Belum pernah";
      try {
        const date = parseDate(timeStr);
        if (isNaN(date.getTime())) return timeStr;
        return new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }).format(date);
      } catch (e) {
        return timeStr;
      }
    }
    function getDeviceLabel(device) {
      if (!device) return "-";
      if (device.includes("Mobile") || device.includes("Android") || device.includes("iPhone")) {
        return "📱 Smartphone";
      }
      if (device.includes("Windows") || device.includes("Macintosh") || device.includes("Linux")) {
        return "💻 Komputer/Laptop";
      }
      return "🌐 Browser";
    }
    head("1b2gy5x", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Reset Login Siswa — Ujian Online</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2"><div class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.refresh)}></path></svg></div> Reset Login Siswa</h1> <p class="text-sm text-slate-500 mt-1">Kelola dan reset status login siswa yang aktif untuk mencegah kecurangan &amp; joki ujian.</p></div> `);
    if (data.hasExamSelected && data.stats.active > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-rose-200 inline-flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.refresh)}></path></svg> Reset Semua Login Active (${escape_html(data.stats.active)})</button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (data.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-3 animate-in"><svg class="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.warning)}></path></svg> <p>Gagal memuat data: ${escape_html(data.error)}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3 animate-in"><svg class="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.warning)}></path></svg> <p>${escape_html(form.error)}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (form?.success) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-in"><svg class="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.check)}></path></svg> <p class="font-medium">${escape_html(form.success)}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="card p-4 border border-slate-100 bg-white shadow-xs"><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"><div>`);
    $$renderer2.select(
      {
        value: selectedExam,
        class: "input-field text-sm font-semibold text-slate-800 border-indigo-200 focus:border-indigo-500 bg-indigo-50/20"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`-- Pilih Ujian --`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(data.exams);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let e = each_array[$$index];
          $$renderer3.option({ value: e.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(e.title)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> `);
    if (data.hasExamSelected && data.availableSessions && data.availableSessions.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div>`);
      $$renderer2.select(
        {
          value: selectedSession,
          class: "input-field text-sm font-medium text-slate-700"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "" }, ($$renderer4) => {
            $$renderer4.push(`-- Semua Sesi --`);
          });
          $$renderer3.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(data.availableSessions);
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let s = each_array_1[$$index_1];
            $$renderer3.option({ value: String(s) }, ($$renderer4) => {
              $$renderer4.push(`Sesi ${escape_html(s)}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      );
      $$renderer2.push(`</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.hasExamSelected) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="relative"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.search)}></path></svg></div> <input type="text"${attr("value", searchQuery)} placeholder="Cari nama, username, NISN..." class="input-field pl-9 text-sm"/></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (!data.hasExamSelected) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="card p-12 border border-slate-100 bg-white text-center shadow-xs space-y-4 animate-in"><div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div> <div class="max-w-md mx-auto"><h3 class="text-lg font-bold text-slate-800">Silakan Pilih Ujian Terlebih Dahulu</h3> <p class="text-sm text-slate-500 mt-1">Pilih salah satu ujian pada dropdown <strong>"-- Pilih Ujian --"</strong> di atas untuk menampilkan daftar peserta dan mengelola status login siswa.</p></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">`);
      StatCard($$renderer2, {
        label: "Total Peserta Ujian",
        value: String(data.stats.total),
        icon: ICONS.users,
        gradient: "indigo"
      });
      $$renderer2.push(`<!----> `);
      StatCard($$renderer2, {
        label: "Sedang Logged In (Aktif)",
        value: String(data.stats.active),
        icon: ICONS.monitor,
        gradient: "amber"
      });
      $$renderer2.push(`<!----> `);
      StatCard($$renderer2, {
        label: "Offline / Session Reset",
        value: String(data.stats.offline),
        icon: ICONS.check,
        gradient: "emerald"
      });
      $$renderer2.push(`<!----></div> <div class="card border border-slate-100 overflow-hidden shadow-xs"><div class="overflow-x-auto"><table class="w-full text-left text-sm text-slate-600"><thead class="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-100"><tr><th class="px-4 py-3.5 text-center w-12">No</th><th class="px-4 py-3.5">Nama Siswa</th><th class="px-4 py-3.5">Username / NISN</th><th class="px-4 py-3.5">Kelas &amp; Ruang</th><th class="px-4 py-3.5 text-center">Status Login</th><th class="px-4 py-3.5">Waktu Aktif</th><th class="px-4 py-3.5">Perangkat</th><th class="px-4 py-3.5 text-center w-36">Aksi</th></tr></thead><tbody class="divide-y divide-slate-100 bg-white">`);
      if (data.students && data.students.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(data.students);
        for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
          let student = each_array_2[i];
          $$renderer2.push(`<tr class="hover:bg-slate-50/60 transition-colors"><td class="px-4 py-3.5 text-center text-slate-400 font-mono text-xs">${escape_html(i + 1)}</td><td class="px-4 py-3.5"><div class="font-bold text-slate-800">${escape_html(student.name)}</div> `);
          if (student.student_session_number) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="mt-0.5"><span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">Sesi ${escape_html(student.student_session_number)}</span></div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></td><td class="px-4 py-3.5 font-mono text-xs text-slate-600"><div>${escape_html(student.username)}</div> `);
          if (student.nisn && student.nisn !== student.username) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="text-slate-400">NISN: ${escape_html(student.nisn)}</div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></td><td class="px-4 py-3.5"><div class="flex flex-col gap-0.5"><span class="font-medium text-slate-700">${escape_html(student.class_name)}</span> `);
          if (student.room_name) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="text-xs text-emerald-600 font-medium">Ruang: ${escape_html(student.room_name)}</span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div></td><td class="px-4 py-3.5 text-center">`);
          if (student.is_logged_in === 1) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200"><span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Aktif Login</span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200"><span class="w-2 h-2 rounded-full bg-slate-300"></span> Offline</span>`);
          }
          $$renderer2.push(`<!--]--></td><td class="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">${escape_html(formatTime(student.last_active_at))}</td><td class="px-4 py-3.5 text-xs text-slate-600 max-w-[160px] truncate"${attr("title", student.login_device || "-")}>${escape_html(getDeviceLabel(student.login_device))}</td><td class="px-4 py-3.5 text-center">`);
          if (student.is_logged_in === 1) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<button class="w-full px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-all shadow-xs inline-flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.refresh)}></path></svg> Reset Login</button>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span class="w-full px-3 py-1.5 rounded-lg bg-slate-100 text-slate-400 text-xs font-medium inline-flex items-center justify-center gap-1 whitespace-nowrap select-none">Offline</span>`);
          }
          $$renderer2.push(`<!--]--></td></tr>`);
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<tr><td colspan="8" class="px-4 py-12 text-center text-slate-400"><div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3"><svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"${attr("d", ICONS.users)}></path></svg></div> <p class="font-medium text-slate-600">Tidak ada data siswa yang sesuai dengan filter.</p> <p class="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter sesi.</p></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div></div>`);
    }
    $$renderer2.push(`<!--]--></div> `);
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
