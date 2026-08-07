import { h as head, e as escape_html, i as ensure_array_like, k as attr, c as stringify, f as bind_props } from "../../../chunks/index.js";
import { p as parseDate } from "../../../chunks/date.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
import { S as StatCard } from "../../../chunks/StatCard.js";
import { I as ICONS } from "../../../chunks/constants.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let currentTime = /* @__PURE__ */ new Date();
    onDestroy(() => {
    });
    function formatScheduleDate(dateString) {
      if (!dateString) return "Belum ditentukan";
      const date = parseDate(dateString);
      const today = /* @__PURE__ */ new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (date.getDate() === tomorrow.getDate() && date.getMonth() === tomorrow.getMonth() && date.getFullYear() === tomorrow.getFullYear()) {
        return "Besok";
      }
      if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
        return "Hari ini";
      }
      return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date);
    }
    function formatTimeRange(startStr, endStr) {
      if (!startStr) return "--:--";
      const start = parseDate(startStr);
      const startFormatted = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(start);
      if (!endStr) return `${startFormatted} - Selesai`;
      const end = parseDate(endStr);
      const endFormatted = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(end);
      if (start.getDate() === end.getDate() && start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return `${startFormatted} - ${endFormatted}`;
      }
      const startDateFormatted = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(start);
      const endDateFormatted = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(end);
      return `${startDateFormatted} ${startFormatted} - ${endDateFormatted} ${endFormatted}`;
    }
    function getScheduleStatus(schedule, now) {
      if (!schedule.start_time) return { state: "UNKNOWN" };
      const startTime = new Date(schedule.start_time);
      const endTime = schedule.end_time ? new Date(schedule.end_time) : null;
      const tokenOpenTime = new Date(startTime.getTime() - 15 * 60 * 1e3);
      if (endTime && now > endTime) {
        return { state: "ENDED" };
      }
      if (now >= tokenOpenTime) {
        if (schedule.token_code) {
          return { state: "MONITOR" };
        } else {
          return { state: "GENERATE_TOKEN" };
        }
      }
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      const examDay = new Date(startTime);
      examDay.setHours(0, 0, 0, 0);
      const diffTime = examDay.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1e3 * 60 * 60 * 24));
      if (diffDays <= 0) {
        const diffMs = tokenOpenTime.getTime() - now.getTime();
        const hours = Math.floor(diffMs / (1e3 * 60 * 60));
        const minutes = Math.floor(diffMs % (1e3 * 60 * 60) / (1e3 * 60));
        const seconds = Math.floor(diffMs % (1e3 * 60) / 1e3);
        const pad = (n) => n.toString().padStart(2, "0");
        const countdownStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        return { state: "COUNTDOWN", text: countdownStr };
      } else if (diffDays === 1) {
        return { state: "WAITING_DAYS", text: "Besok" };
      } else {
        return { state: "WAITING_DAYS", text: `${diffDays} hari lagi` };
      }
    }
    head("9iohvt", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Dashboard Pengawas — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div><h1 class="text-2xl font-bold text-slate-800">Dashboard Pengawas</h1> <p class="text-sm text-slate-500 mt-1">Selamat datang, ${escape_html(data.user.name)}.</p></div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">`);
    StatCard($$renderer2, {
      label: "Ujian Aktif",
      value: String(data.stats.activeExams),
      icon: ICONS.exam,
      gradient: "indigo"
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      label: "Total Token",
      value: String(data.stats.totalTokens),
      icon: ICONS.token,
      gradient: "amber"
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      label: "Sedang Mengerjakan",
      value: String(data.stats.activeAttempts),
      icon: ICONS.monitor,
      gradient: "cyan"
    });
    $$renderer2.push(`<!----></div> <div class="mt-8"><h2 class="text-xl font-bold text-slate-800 mb-4">Jadwal Mengawas</h2> `);
    if (data.schedules && data.schedules.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
      const each_array = ensure_array_like(data.schedules);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let schedule = each_array[$$index];
        $$renderer2.push(`<div class="card p-5 border border-slate-100 relative overflow-hidden group"><div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div> <div class="flex items-start justify-between gap-4 mb-3"><div class="flex-1"><h3 class="font-bold text-slate-800 text-lg leading-tight mb-1">${escape_html(schedule.title)}</h3> <div class="flex items-center gap-1.5 text-sm font-medium text-emerald-600"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg> ${escape_html(schedule.subject_name || "Umum")}</div></div> `);
        if (schedule.is_active) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge-success whitespace-nowrap">Aktif</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="badge bg-slate-100 text-slate-500 whitespace-nowrap">Selesai/Non-aktif</span>`);
        }
        $$renderer2.push(`<!--]--></div> <div class="space-y-2 mt-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50"><div class="flex items-center gap-2.5 text-sm text-slate-600"><div class="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div> <div><p class="text-xs text-slate-400 font-medium leading-none mb-1">Tanggal</p> <p class="font-medium text-slate-700">${escape_html(formatScheduleDate(schedule.start_time))}</p></div></div> <div class="flex items-center gap-2.5 text-sm text-slate-600"><div class="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div> <div><p class="text-xs text-slate-400 font-medium leading-none mb-1">Waktu &amp; Durasi</p> <p class="font-medium text-slate-700">${escape_html(formatTimeRange(schedule.start_time, schedule.end_time))} <span class="text-slate-400 font-normal">(${escape_html(schedule.duration_minutes)} menit)</span></p></div></div> <div class="flex items-center gap-2.5 text-sm text-slate-600 mt-3 pt-3 border-t border-slate-100"><div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div> <div class="flex-1"><p class="text-xs text-slate-400 font-medium leading-none mb-1">Peserta Ujian</p> <p class="font-medium text-slate-700">${escape_html(schedule.participant_count)} Siswa</p></div> <button class="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors" title="Lihat Daftar Peserta"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></button></div></div> <div class="mt-4">`);
        {
          $$renderer2.push("<!--[0-->");
          const status = getScheduleStatus(schedule, currentTime);
          if (status.state === "ENDED") {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold bg-red-50 text-red-500 border border-red-200 cursor-not-allowed"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Berakhir</div>`);
          } else if (status.state === "MONITOR") {
            $$renderer2.push("<!--[1-->");
            $$renderer2.push(`<a${attr("href", `/pengawas/monitor?exam_id=${stringify(schedule.exam_id)}`)} class="btn-primary w-full shadow-md shadow-indigo-500/20 py-2.5 justify-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.monitor)}></path></svg> Monitoring Ujian</a>`);
          } else if (status.state === "GENERATE_TOKEN") {
            $$renderer2.push("<!--[2-->");
            $$renderer2.push(`<a${attr("href", `/pengawas/tokens?exam_id=${stringify(schedule.exam_id)}&generate=1`)} class="btn-secondary w-full py-2.5 justify-center gap-2 hover:bg-slate-100 hover:text-slate-800 border-dashed border-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.plus)}></path></svg> Generate Token</a>`);
          } else if (status.state === "COUNTDOWN") {
            $$renderer2.push("<!--[3-->");
            $$renderer2.push(`<div class="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 border border-slate-200 font-mono shadow-inner tracking-wider"><svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${escape_html(status.text)}</div>`);
          } else if (status.state === "WAITING_DAYS") {
            $$renderer2.push("<!--[4-->");
            $$renderer2.push(`<div class="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold bg-slate-50 text-slate-500 border border-slate-200 cursor-not-allowed"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> Tersedia ${escape_html(status.text)}</div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<div class="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed">Jadwal tidak valid</div>`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 border-dashed"><div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm"><svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div> <p class="text-slate-500">Belum ada jadwal mengawas untuk Anda.</p></div>`);
    }
    $$renderer2.push(`<!--]--></div> <h2 class="text-xl font-bold text-slate-800 mb-2 mt-8">Akses Cepat</h2> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><a href="/pengawas/tokens" class="card-hover p-6 text-center group"><div class="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20"><svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.token)}></path></svg></div> <h3 class="font-bold text-slate-800">Kelola Token Ujian</h3> <p class="text-sm text-slate-500 mt-1">Generate dan rilis token untuk siswa</p></a> <a href="/pengawas/monitor" class="card-hover p-6 text-center group"><div class="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20"><svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.monitor)}></path></svg></div> <h3 class="font-bold text-slate-800">Monitoring Ujian</h3> <p class="text-sm text-slate-500 mt-1">Pantau siswa yang sedang mengerjakan</p></a></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
