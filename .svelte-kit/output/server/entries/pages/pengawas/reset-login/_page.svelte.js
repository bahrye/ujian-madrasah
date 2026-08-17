import { h as head, k as attr, e as escape_html, i as ensure_array_like, f as bind_props } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { S as StatCard } from "../../../../chunks/StatCard.js";
import { I as ICONS } from "../../../../chunks/constants.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let form = $$props["form"];
    let searchQuery = data.filters.q || "";
    let selectedExam = data.filters.exam_id || "";
    let selectedSession = data.filters.session_number || "";
    let selectedRoom = data.filters.room_id || "";
    let selectedClass = data.filters.class_id || "";
    let selectedStatus = data.filters.status || "";
    let isSubmitting = false;
    function formatTime(timeStr) {
      if (!timeStr) return "Belum pernah";
      try {
        const date = new Date(timeStr);
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
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2"><div class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.refresh)}></path></svg></div> Reset Login Siswa</h1> <p class="text-sm text-slate-500 mt-1">Kelola dan reset status login siswa yang sudah aktif di perangkat lain untuk mencegah joki / kecurangan ujian.</p></div> `);
    if (data.stats.active > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="btn-danger flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 py-2.5 px-4 font-semibold text-sm"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.refresh)}></path></svg> Reset Semua Login Active (${escape_html(data.stats.active)})</button>`);
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
    $$renderer2.push(`<!--]--> <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">`);
    StatCard($$renderer2, {
      label: "Total Peserta Diawasi",
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
    $$renderer2.push(`<!----></div> <div class="card p-4 border border-slate-100 bg-white space-y-3"><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"><div class="relative"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.search)}></path></svg></div> <input type="text"${attr("value", searchQuery)} placeholder="Cari nama, username, atau NISN..." class="input-field pl-9 text-sm"/></div> <div>`);
    $$renderer2.select(
      {
        value: selectedExam,
        class: "input-field text-sm font-medium text-slate-700"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`-- Semua Ujian --`);
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
    $$renderer2.push(`</div> <div>`);
    $$renderer2.select({ value: selectedSession, class: "input-field text-sm" }, ($$renderer3) => {
      $$renderer3.option({ value: "" }, ($$renderer4) => {
        $$renderer4.push(`-- Semua Sesi Ujian --`);
      });
      $$renderer3.option({ value: "1" }, ($$renderer4) => {
        $$renderer4.push(`Sesi 1`);
      });
      $$renderer3.option({ value: "2" }, ($$renderer4) => {
        $$renderer4.push(`Sesi 2`);
      });
      $$renderer3.option({ value: "3" }, ($$renderer4) => {
        $$renderer4.push(`Sesi 3`);
      });
      $$renderer3.option({ value: "4" }, ($$renderer4) => {
        $$renderer4.push(`Sesi 4`);
      });
      $$renderer3.option({ value: "5" }, ($$renderer4) => {
        $$renderer4.push(`Sesi 5`);
      });
    });
    $$renderer2.push(`</div></div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100"><div>`);
    $$renderer2.select({ value: selectedRoom, class: "input-field text-sm" }, ($$renderer3) => {
      $$renderer3.option({ value: "" }, ($$renderer4) => {
        $$renderer4.push(`-- Semua Ruang --`);
      });
      $$renderer3.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(data.rooms);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let r = each_array_1[$$index_1];
        $$renderer3.option({ value: r.id }, ($$renderer4) => {
          $$renderer4.push(`${escape_html(r.name)}`);
        });
      }
      $$renderer3.push(`<!--]-->`);
    });
    $$renderer2.push(`</div> <div>`);
    $$renderer2.select({ value: selectedClass, class: "input-field text-sm" }, ($$renderer3) => {
      $$renderer3.option({ value: "" }, ($$renderer4) => {
        $$renderer4.push(`-- Semua Kelas --`);
      });
      $$renderer3.push(`<!--[-->`);
      const each_array_2 = ensure_array_like(data.classes);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let c = each_array_2[$$index_2];
        $$renderer3.option({ value: c.id }, ($$renderer4) => {
          $$renderer4.push(`${escape_html(c.name)}`);
        });
      }
      $$renderer3.push(`<!--]-->`);
    });
    $$renderer2.push(`</div> <div>`);
    $$renderer2.select(
      {
        value: selectedStatus,
        class: "input-field text-sm font-medium"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`-- Semua Status Login --`);
        });
        $$renderer3.option({ value: "active" }, ($$renderer4) => {
          $$renderer4.push(`🔴 Sedang Logged In (Aktif)`);
        });
        $$renderer3.option({ value: "offline" }, ($$renderer4) => {
          $$renderer4.push(`⚪ Offline / Reset`);
        });
      }
    );
    $$renderer2.push(`</div></div></div> <div class="card border border-slate-100 overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left text-sm text-slate-600"><thead class="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-100"><tr><th class="px-4 py-3 text-center w-12">No</th><th class="px-4 py-3">Nama Siswa</th><th class="px-4 py-3">Username / NISN</th><th class="px-4 py-3">Ujian &amp; Sesi</th><th class="px-4 py-3">Kelas &amp; Ruang</th><th class="px-4 py-3 text-center">Status Login</th><th class="px-4 py-3">Waktu Aktif</th><th class="px-4 py-3">Perangkat</th><th class="px-4 py-3 text-right">Aksi</th></tr></thead><tbody class="divide-y divide-slate-100 bg-white">`);
    if (data.students && data.students.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<!--[-->`);
      const each_array_3 = ensure_array_like(data.students);
      for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
        let student = each_array_3[i];
        $$renderer2.push(`<tr class="hover:bg-slate-50/60 transition-colors"><td class="px-4 py-3 text-center text-slate-400 font-mono text-xs">${escape_html(i + 1)}</td><td class="px-4 py-3"><div class="font-bold text-slate-800">${escape_html(student.name)}</div></td><td class="px-4 py-3 font-mono text-xs text-slate-600"><div>${escape_html(student.username)}</div> `);
        if (student.nisn && student.nisn !== student.username) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="text-slate-400">NISN: ${escape_html(student.nisn)}</div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></td><td class="px-4 py-3"><div class="flex flex-col gap-0.5"><span class="font-medium text-slate-800 text-xs truncate max-w-[160px]"${attr("title", student.exam_title || "-")}>${escape_html(student.exam_title || "-")}</span> <span class="inline-flex items-center gap-1 w-fit px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">Sesi ${escape_html(student.student_session_number || 1)}</span></div></td><td class="px-4 py-3"><div class="flex flex-col gap-0.5"><span class="font-medium text-slate-700">${escape_html(student.class_name)}</span> `);
        if (student.room_name) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-xs text-emerald-600 font-medium">Ruang: ${escape_html(student.room_name)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></td><td class="px-4 py-3 text-center">`);
        if (student.is_logged_in === 1) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200"><span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Aktif Login</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200"><span class="w-2 h-2 rounded-full bg-slate-300"></span> Offline / Reset</span>`);
        }
        $$renderer2.push(`<!--]--></td><td class="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">${escape_html(formatTime(student.last_active_at))}</td><td class="px-4 py-3 text-xs text-slate-600 max-w-[160px] truncate"${attr("title", student.login_device || "-")}>${escape_html(getDeviceLabel(student.login_device))}</td><td class="px-4 py-3 text-right">`);
        if (student.is_logged_in === 1) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<button class="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 border border-amber-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1 ml-auto"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.refresh)}></path></svg> Reset Login</button>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<form method="POST" action="?/resetLogin"><input type="hidden" name="student_id"${attr("value", student.id)}/> <button type="submit"${attr("disabled", isSubmitting, true)} class="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-1 ml-auto" title="Paksa Reset ulang session"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.refresh)}></path></svg> Paksa Reset</button></form>`);
        }
        $$renderer2.push(`<!--]--></td></tr>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<tr><td colspan="9" class="px-4 py-12 text-center text-slate-400"><div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3"><svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"${attr("d", ICONS.users)}></path></svg></div> <p class="font-medium text-slate-600">Tidak ada data siswa diawasi yang sesuai filter.</p> <p class="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian, filter ujian, atau sesi ujian.</p></td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div></div> `);
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
