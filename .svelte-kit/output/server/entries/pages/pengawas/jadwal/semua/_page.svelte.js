import { h as head, f as ensure_array_like, e as escape_html, j as attr, d as bind_props } from "../../../../../chunks/index.js";
import { I as ICONS } from "../../../../../chunks/constants.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let filteredSchedules;
    let data = $$props["data"];
    let selectedClass = "";
    function formatScheduleDate(dateString) {
      if (!dateString) return "Belum ditentukan";
      const date = new Date(dateString);
      const today = /* @__PURE__ */ new Date();
      date.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffTime = date.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1e3 * 60 * 60 * 24));
      if (diffDays === 0) return "Hari ini";
      if (diffDays === 1) return "Besok";
      if (diffDays === 2) return "Lusa";
      if (diffDays > 2) return `${diffDays} hari lagi`;
      if (diffDays === -1) return "Kemarin";
      if (diffDays < -1) return `${Math.abs(diffDays)} hari yang lalu`;
      return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date);
    }
    function formatTimeRange(startStr, endStr) {
      if (!startStr) return "--:--";
      const start = new Date(startStr);
      const startFormatted = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(start);
      if (!endStr) return `${startFormatted} - Selesai`;
      const end = new Date(endStr);
      const endFormatted = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(end);
      if (start.getDate() === end.getDate() && start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return `${startFormatted} - ${endFormatted}`;
      }
      return `${startFormatted} - ${endFormatted}`;
    }
    function getExamStatus(exam) {
      if (!exam.is_active) return "inactive";
      const now = /* @__PURE__ */ new Date();
      if (exam.end_time && now > new Date(exam.end_time)) {
        return "ended";
      }
      if (exam.start_time && now < new Date(exam.start_time)) {
        return "upcoming";
      }
      return "active";
    }
    filteredSchedules = data.schedules;
    head("1kpmac9", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Semua Jadwal — Pengawas</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div><h1 class="text-2xl font-bold text-slate-800 tracking-tight">Semua Jadwal Ujian</h1> <p class="text-sm text-slate-500 mt-1">Daftar semua jadwal ujian yang aktif di sekolah.</p></div> <div class="flex items-center gap-2"><svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg> `);
    $$renderer2.select({ value: selectedClass, class: "input max-w-xs" }, ($$renderer3) => {
      $$renderer3.option({ value: "" }, ($$renderer4) => {
        $$renderer4.push(`Semua Kelas`);
      });
      $$renderer3.push(`<!--[-->`);
      const each_array = ensure_array_like(data.classes);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let cls = each_array[$$index];
        $$renderer3.option({ value: cls.name }, ($$renderer4) => {
          $$renderer4.push(`${escape_html(cls.name)}`);
        });
      }
      $$renderer3.push(`<!--]-->`);
    });
    $$renderer2.push(`</div></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">`);
    const each_array_1 = ensure_array_like(filteredSchedules);
    if (each_array_1.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let exam = each_array_1[$$index_1];
        $$renderer2.push(`<div class="card p-5 bg-white border border-slate-200 flex flex-col h-full hover:shadow-lg transition-shadow duration-300"><div><div class="flex items-start justify-between mb-4"><div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-100 flex items-center justify-center text-indigo-600 shadow-sm"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.calendar)}></path></svg></div> `);
        if (getExamStatus(exam) === "active") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge-success text-xs font-semibold px-2.5 py-1 rounded-md animate-pulse">Sedang Berlangsung</span>`);
        } else if (getExamStatus(exam) === "upcoming") {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<span class="badge-warning text-xs font-semibold px-2.5 py-1 rounded-md">Akan Datang</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="badge-danger text-xs font-semibold px-2.5 py-1 rounded-md">Telah Berakhir</span>`);
        }
        $$renderer2.push(`<!--]--></div> <h3 class="font-bold text-slate-800 text-lg leading-tight mb-1"${attr("title", exam.title)}>${escape_html(exam.title.length > 35 ? exam.title.substring(0, 35) + "..." : exam.title)}</h3> <div class="flex items-center gap-2 mb-4"><span class="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">${escape_html(exam.exam_type_name || "Ujian")}</span> `);
        if (exam.subject_name) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 truncate max-w-[120px]"${attr("title", exam.subject_name)}>${escape_html(exam.subject_name)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div> <div class="mt-auto space-y-3 pt-4 border-t border-slate-100"><div class="flex flex-col gap-2"><div class="flex items-center gap-2 text-sm text-slate-600"><svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> <span class="font-medium">${escape_html(formatScheduleDate(exam.start_time))}</span></div> <div class="flex items-center gap-2 text-sm text-slate-600"><svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span class="font-medium">${escape_html(formatTimeRange(exam.start_time, exam.end_time))} (${escape_html(exam.duration_minutes)} mnt)</span></div> `);
        if (exam.class_names) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="flex items-start gap-2 text-sm text-slate-600"><svg class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.school)}></path></svg> <span class="font-medium line-clamp-2"${attr("title", exam.class_names)}>${escape_html(exam.class_names)}</span></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="flex items-start gap-2 text-sm text-slate-600"><svg class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.users)}></path></svg> <span class="font-medium line-clamp-2 text-indigo-600"${attr("title", exam.proctor_names || "Tidak ada pengawas")}>${escape_html(exam.proctor_names || "Tidak ada pengawas")}</span></div></div></div></div>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="col-span-full"><div class="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm"><div class="w-20 h-20 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4"><svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div> <h3 class="text-lg font-bold text-slate-700 mb-1">Tidak Ada Ujian</h3> <p class="text-sm">Tidak ada jadwal ujian aktif yang ditemukan berdasarkan filter Anda.</p></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
