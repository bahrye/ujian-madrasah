import { h as head, k as attr, j as attr_class, e as escape_html, i as ensure_array_like, c as stringify, f as bind_props } from "../../../../chunks/index.js";
import { p as parseDate } from "../../../../chunks/date.js";
import { p as parseProctors } from "../../../../chunks/format.js";
import { I as ICONS } from "../../../../chunks/constants.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let filteredSchedules, examsByDate, unscheduledExams, calendarGrid, selectedDateExams, totalMonthExams;
    let data = $$props["data"];
    const MONTH_NAMES = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember"
    ];
    const DAY_NAMES_SHORT = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const today = /* @__PURE__ */ new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let selectedDateKey = toDateKey(today);
    let searchQuery = "";
    function toDateKey(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
    function formatFullDate(dateKey) {
      const parts = dateKey.split("-");
      if (parts.length !== 3) return dateKey;
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date);
    }
    function getDateRelativeLabel(dateKey) {
      const parts = dateKey.split("-");
      if (parts.length !== 3) return null;
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const todayClone = /* @__PURE__ */ new Date();
      date.setHours(0, 0, 0, 0);
      todayClone.setHours(0, 0, 0, 0);
      const diffTime = date.getTime() - todayClone.getTime();
      const diffDays = Math.round(diffTime / (1e3 * 60 * 60 * 24));
      if (diffDays === 0) return { text: "Hari Ini", class: "badge-primary" };
      if (diffDays === 1) return { text: "Besok", class: "badge-primary" };
      if (diffDays === 2) return { text: "Lusa", class: "badge-primary" };
      if (diffDays > 2) return { text: `${diffDays} hari lagi`, class: "badge-primary" };
      if (diffDays === -1) return { text: "Kemarin", class: "badge-secondary" };
      if (diffDays < -1) return {
        text: `${Math.abs(diffDays)} hari lalu`,
        class: "badge-secondary"
      };
      return null;
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
      const startDateFormatted = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(start);
      const endDateFormatted = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(end);
      return `${startDateFormatted} ${startFormatted} - ${endDateFormatted} ${endFormatted}`;
    }
    function getExamStatus(exam) {
      const now = /* @__PURE__ */ new Date();
      if (exam.end_time && now > parseDate(exam.end_time)) {
        return "ended";
      }
      if (exam.start_time && now < parseDate(exam.start_time)) {
        return "upcoming";
      }
      return "active";
    }
    function getExamDisplayStatus(exam) {
      const isDone = exam.attempt_status && ["selesai", "waktu_habis", "remedial"].includes(exam.attempt_status);
      if (isDone) {
        return {
          type: "done",
          label: "Selesai",
          bgClass: "bg-emerald-50 hover:bg-emerald-100/70",
          textClass: "text-emerald-700",
          dotClass: "bg-emerald-500",
          borderClass: "border-emerald-200",
          badgeClass: "badge-success"
        };
      }
      if (exam.attempt_status === "mengerjakan") {
        return {
          type: "active",
          label: "Sedang Mengerjakan",
          bgClass: "bg-amber-50 hover:bg-amber-100/70",
          textClass: "text-amber-800 font-bold",
          dotClass: "bg-amber-500 animate-pulse",
          borderClass: "border-amber-300",
          badgeClass: "badge-warning"
        };
      }
      const timing = getExamStatus(exam);
      if (timing === "active") {
        return {
          type: "active",
          label: "Sedang Berlangsung",
          bgClass: "bg-amber-50 hover:bg-amber-100/70",
          textClass: "text-amber-800 font-bold",
          dotClass: "bg-amber-500 animate-pulse",
          borderClass: "border-amber-300",
          badgeClass: "badge-warning"
        };
      }
      if (timing === "ended") {
        return {
          type: "ended",
          label: "Berakhir",
          bgClass: "bg-rose-50 hover:bg-rose-100/70",
          textClass: "text-rose-700",
          dotClass: "bg-rose-500",
          borderClass: "border-rose-200",
          badgeClass: "badge-danger"
        };
      }
      return {
        type: "upcoming",
        label: "Akan Datang",
        bgClass: "bg-indigo-50 hover:bg-indigo-100/70",
        textClass: "text-indigo-700",
        dotClass: "bg-indigo-500",
        borderClass: "border-indigo-200",
        badgeClass: "badge-primary"
      };
    }
    function getCellDominantStatus(exams) {
      if (!exams || exams.length === 0) return null;
      const hasActive = exams.some((e) => {
        if (e.attempt_status === "mengerjakan") return true;
        const isDone = e.attempt_status && ["selesai", "waktu_habis", "remedial"].includes(e.attempt_status);
        return !isDone && getExamStatus(e) === "active";
      });
      if (hasActive) {
        return {
          type: "active",
          dotClass: "bg-amber-500 ring-2 ring-amber-200 animate-pulse",
          badgeClass: "bg-amber-500 text-white",
          cellBorder: "border-amber-300 bg-amber-50/30"
        };
      }
      const hasUpcoming = exams.some((e) => {
        const isDone = e.attempt_status && ["selesai", "waktu_habis", "remedial"].includes(e.attempt_status);
        return !isDone && getExamStatus(e) === "upcoming";
      });
      if (hasUpcoming) {
        return {
          type: "upcoming",
          dotClass: "bg-indigo-500 ring-2 ring-indigo-200",
          badgeClass: "bg-indigo-600 text-white",
          cellBorder: "border-indigo-200 bg-indigo-50/20"
        };
      }
      const allDone = exams.every((e) => e.attempt_status && ["selesai", "waktu_habis", "remedial"].includes(e.attempt_status));
      if (allDone) {
        return {
          type: "done",
          dotClass: "bg-emerald-500 ring-2 ring-emerald-200",
          badgeClass: "bg-emerald-600 text-white",
          cellBorder: "border-emerald-200 bg-emerald-50/20"
        };
      }
      return {
        type: "ended",
        dotClass: "bg-rose-500 ring-2 ring-rose-200",
        badgeClass: "bg-rose-500 text-white",
        cellBorder: "border-rose-200 bg-rose-50/20"
      };
    }
    function buildCalendarGrid(year, month, selectedKey, examsMap) {
      const todayKey = toDateKey(/* @__PURE__ */ new Date());
      const firstDay = new Date(year, month, 1);
      const startingDay = (firstDay.getDay() + 6) % 7;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const daysInPrevMonth = new Date(year, month, 0).getDate();
      const cells = [];
      for (let i = startingDay - 1; i >= 0; i--) {
        const dayNum = daysInPrevMonth - i;
        const cellDate = new Date(year, month - 1, dayNum);
        const dateKey = toDateKey(cellDate);
        cells.push({
          date: cellDate,
          dateKey,
          dayNumber: dayNum,
          isCurrentMonth: false,
          isToday: dateKey === todayKey,
          isSelected: dateKey === selectedKey,
          exams: examsMap.get(dateKey) || []
        });
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const cellDate = new Date(year, month, d);
        const dateKey = toDateKey(cellDate);
        cells.push({
          date: cellDate,
          dateKey,
          dayNumber: d,
          isCurrentMonth: true,
          isToday: dateKey === todayKey,
          isSelected: dateKey === selectedKey,
          exams: examsMap.get(dateKey) || []
        });
      }
      const totalCells = cells.length > 35 ? 42 : 35;
      const remaining = totalCells - cells.length;
      for (let d = 1; d <= remaining; d++) {
        const cellDate = new Date(year, month + 1, d);
        const dateKey = toDateKey(cellDate);
        cells.push({
          date: cellDate,
          dateKey,
          dayNumber: d,
          isCurrentMonth: false,
          isToday: dateKey === todayKey,
          isSelected: dateKey === selectedKey,
          exams: examsMap.get(dateKey) || []
        });
      }
      return cells;
    }
    filteredSchedules = (data.schedules || []).filter((exam) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = (exam.title || "").toLowerCase().includes(q);
      const subjectMatch = (exam.subject || "").toLowerCase().includes(q);
      const subjectCodeMatch = (exam.subject_code || "").toLowerCase().includes(q);
      const roomMatch = (exam.room_name || "").toLowerCase().includes(q);
      const proctorsStr = (exam.proctors || "").toString().toLowerCase();
      return titleMatch || subjectMatch || subjectCodeMatch || roomMatch || proctorsStr.includes(q);
    });
    examsByDate = (() => {
      const map = /* @__PURE__ */ new Map();
      for (const exam of filteredSchedules) {
        if (exam.start_time) {
          const date = parseDate(exam.start_time);
          const key = toDateKey(date);
          if (!map.has(key)) {
            map.set(key, []);
          }
          map.get(key).push(exam);
        }
      }
      return map;
    })();
    unscheduledExams = filteredSchedules.filter((exam) => !exam.start_time);
    calendarGrid = buildCalendarGrid(currentYear, currentMonth, selectedDateKey, examsByDate);
    selectedDateExams = examsByDate.get(selectedDateKey) || [];
    totalMonthExams = calendarGrid.filter((c) => c.isCurrentMonth).reduce((sum, c) => sum + c.exams.length, 0);
    head("8o0fw0", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Jadwal Ujian — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm"><div><div class="flex items-center gap-2.5"><div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.calendar)}></path></svg></div> <div><h1 class="text-2xl font-bold text-slate-800">Jadwal Ujian</h1> <p class="text-xs sm:text-sm text-slate-500">Daftar jadwal ujian yang harus Anda ikuti</p></div></div></div> <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"><div class="inline-flex bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-inner self-start sm:self-auto"><button type="button"${attr_class(`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${"bg-white text-indigo-700 shadow-sm"}`)}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.calendar)}></path></svg> <span>Kalender</span></button> <button type="button"${attr_class(`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${"text-slate-600 hover:text-slate-900"}`)}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg> <span>Kartu</span></button></div> <div class="relative w-full sm:w-64"><input type="text"${attr("value", searchQuery)} placeholder="Cari mapel, ruang, pengawas..." class="input pl-9 pr-8 py-2 w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm bg-white"/> <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"><div class="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-6 select-none touch-pan-y"><div class="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100"><div class="flex items-center gap-2"><h2 class="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">${escape_html(MONTH_NAMES[currentMonth])} ${escape_html(currentYear)}</h2> `);
      if (totalMonthExams > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="badge-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">${escape_html(totalMonthExams)} Ujian</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="flex items-center gap-1.5 self-end sm:self-auto"><button type="button" class="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors" title="Kembali ke hari ini">Hari Ini</button> <div class="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5"><button type="button" class="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-colors shadow-none hover:shadow-sm" title="Bulan sebelumnya"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg></button> <button type="button" class="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-colors shadow-none hover:shadow-sm" title="Bulan berikutnya"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg></button></div></div></div> <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center"><!--[-->`);
      const each_array = ensure_array_like(DAY_NAMES_SHORT);
      for (let idx = 0, $$length = each_array.length; idx < $$length; idx++) {
        let dayName = each_array[idx];
        $$renderer2.push(`<div${attr_class(`py-2 text-xs font-bold uppercase tracking-wider ${idx >= 5 ? "text-rose-500 bg-rose-50/50" : "text-slate-500 bg-slate-50"} rounded-lg`)}>${escape_html(dayName)}</div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-7 gap-1 sm:gap-2"><!--[-->`);
      const each_array_1 = ensure_array_like(calendarGrid);
      for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
        let cell = each_array_1[$$index_2];
        const hasExams = cell.exams.length > 0;
        const dominant = getCellDominantStatus(cell.exams);
        $$renderer2.push(`<button type="button"${attr_class(`text-left rounded-xl p-1.5 sm:p-2 transition-all flex flex-col justify-between min-h-[64px] sm:min-h-[88px] border relative group focus:outline-none cursor-pointer ${cell.isSelected ? "ring-2 ring-indigo-600 bg-indigo-50/80 border-indigo-300 shadow-sm z-10" : cell.isToday ? "ring-2 ring-indigo-400/80 bg-indigo-50/30 border-indigo-200" : hasExams && dominant ? `${dominant.cellBorder} hover:shadow-sm` : cell.isCurrentMonth ? "bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700" : "bg-slate-50/50 border-slate-100 text-slate-300 opacity-60"}`)}><div class="flex items-center justify-between w-full"><span${attr_class(`text-xs sm:text-sm font-bold ${cell.isSelected ? "text-indigo-900 font-black" : cell.isToday ? "text-indigo-600 font-extrabold" : cell.isCurrentMonth ? "text-slate-800" : "text-slate-400"}`)}>${escape_html(cell.dayNumber)}</span> `);
        if (cell.isToday) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.2 bg-indigo-600 text-white rounded-md uppercase tracking-tight">Hari ini</span> `);
          if (dominant) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span${attr_class(`sm:hidden w-2 h-2 rounded-full ${stringify(dominant.dotClass)}`)}></span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span class="sm:hidden w-2 h-2 rounded-full bg-indigo-600"></span>`);
          }
          $$renderer2.push(`<!--]-->`);
        } else if (hasExams && dominant) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<span${attr_class(`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${stringify(dominant.dotClass)}`)}></span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="w-full mt-1 space-y-1">`);
        if (hasExams && dominant) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="sm:hidden flex items-center justify-center"><span${attr_class(`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${stringify(dominant.badgeClass)} leading-none shadow-xs`)}>${escape_html(cell.exams.length)}</span></div> <div class="hidden sm:block space-y-1"><!--[-->`);
          const each_array_2 = ensure_array_like(cell.exams.slice(0, 2));
          for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
            let exam = each_array_2[$$index_1];
            const display = getExamDisplayStatus(exam);
            $$renderer2.push(`<div${attr_class(`text-[10px] font-semibold truncate px-1.5 py-0.5 rounded flex items-center gap-1 border ${stringify(display.bgClass)} ${stringify(display.textClass)} ${stringify(display.borderClass)}`)}${attr("title", `${stringify(exam.title)} (${stringify(display.label)})`)}><span${attr_class(`w-1.5 h-1.5 rounded-full flex-shrink-0 ${stringify(display.dotClass)}`)}></span> <span class="truncate">${escape_html(exam.subject_code || exam.subject || exam.title)}</span></div>`);
          }
          $$renderer2.push(`<!--]--> `);
          if (cell.exams.length > 2) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="text-[9px] font-bold text-slate-500 text-center">+${escape_html(cell.exams.length - 2)} lainnya</div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></button>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500"><div class="flex items-center gap-4 flex-wrap"><div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> <span class="text-slate-600 font-medium">Akan Datang</span></div> <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> <span class="text-slate-600 font-medium">Sedang Berlangsung</span></div> <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> <span class="text-slate-600 font-medium">Selesai</span></div> <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> <span class="text-slate-600 font-medium">Telah Berakhir</span></div></div> <div class="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto"><span class="sm:hidden text-[11px] text-slate-400 font-medium flex items-center gap-1"><svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg> Geser ↔ ganti bulan</span> <button type="button" class="text-indigo-600 hover:text-indigo-800 font-semibold underline text-xs transition-colors">Lompat ke Ujian Terdekat</button></div></div></div> <div id="selected-date-details-section" class="lg:col-span-5 xl:col-span-4 space-y-4 scroll-mt-20"><div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sticky top-6"><div class="flex items-start justify-between gap-2 mb-4 pb-4 border-b border-slate-100"><div><div class="flex items-center gap-1.5 text-indigo-600 font-semibold text-xs uppercase tracking-wider mb-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.calendar)}></path></svg> <span>Informasi Jadwal Ujian</span></div> <h3 class="font-black text-slate-800 text-lg sm:text-xl leading-tight">${escape_html(formatFullDate(selectedDateKey))}</h3></div> `);
      if (getDateRelativeLabel(selectedDateKey)) {
        $$renderer2.push("<!--[0-->");
        const rel = getDateRelativeLabel(selectedDateKey);
        $$renderer2.push(`<span${attr_class(`${stringify(rel.class)} font-bold text-xs px-2.5 py-1 rounded-lg flex-shrink-0`)}>${escape_html(rel.text)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (selectedDateExams.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1"><!--[-->`);
        const each_array_3 = ensure_array_like(selectedDateExams);
        for (let $$index_4 = 0, $$length = each_array_3.length; $$index_4 < $$length; $$index_4++) {
          let exam = each_array_3[$$index_4];
          const status = getExamStatus(exam);
          const display = getExamDisplayStatus(exam);
          const isCompleted = exam.attempt_status && ["selesai", "waktu_habis", "remedial"].includes(exam.attempt_status);
          $$renderer2.push(`<div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md hover:border-indigo-200 space-y-3"><div class="flex items-center justify-between gap-2"><span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide">${escape_html(exam.subject_code || exam.subject || "UMUM")}</span> <span${attr_class(`${stringify(display.badgeClass)} text-xs font-semibold px-2.5 py-0.5 rounded-md flex-shrink-0 ${display.type === "active" ? "animate-pulse" : ""}`)}>${escape_html(display.label)}</span></div> <h4 class="font-bold text-slate-800 text-sm sm:text-base leading-snug break-words">${escape_html(exam.title)}</h4> `);
          if (exam.room_name || exam.session_number) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="flex items-center gap-2 flex-wrap">`);
            if (exam.room_name) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<span class="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md">${escape_html(exam.room_name)}</span>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]--> `);
            if (exam.session_number) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<span class="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md">Sesi ${escape_html(exam.session_number)}</span>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]--></div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> <div class="space-y-1.5 text-xs sm:text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100"><div class="flex items-center gap-2"><svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path></svg> <span><strong>Pukul:</strong> ${escape_html(formatTimeRange(exam.start_time, exam.end_time))} `);
          if (exam.has_sessions && exam.session_number) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="text-[11px] font-semibold px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded ml-1">Sesi ${escape_html(exam.session_number)}</span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></span></div> <div class="flex items-center gap-2"><svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg> <span><strong>Durasi:</strong> ${escape_html(exam.duration_minutes)} menit</span></div> <div class="flex items-center gap-2"><svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> <span><strong>Jumlah Soal:</strong> ${escape_html(exam.question_count)} butir</span></div> `);
          if (exam.proctors) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="flex items-start gap-2 pt-1 border-t border-slate-100"><svg class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.users)}></path></svg> <div class="space-y-0.5"><!--[-->`);
            const each_array_4 = ensure_array_like(parseProctors(exam.proctors));
            for (let $$index_3 = 0, $$length2 = each_array_4.length; $$index_3 < $$length2; $$index_3++) {
              let p = each_array_4[$$index_3];
              $$renderer2.push(`<div><span class="font-medium text-slate-700">${escape_html(p.label)}:</span> ${escape_html(p.name)}</div>`);
            }
            $$renderer2.push(`<!--]--></div></div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div> <div class="pt-1">`);
          if (isCompleted) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<button disabled="" class="btn w-full justify-center bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed shadow-none text-xs sm:text-sm py-2.5 font-bold"><svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.check)}></path></svg> Ujian Selesai Dikerjakan</button>`);
          } else if (status === "ended") {
            $$renderer2.push("<!--[1-->");
            $$renderer2.push(`<div class="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-bold cursor-not-allowed"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.warning)}></path></svg> <span>Ujian Telah Berakhir</span></div>`);
          } else if (status === "upcoming") {
            $$renderer2.push("<!--[2-->");
            $$renderer2.push(`<button disabled="" class="btn w-full justify-center bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed text-xs sm:text-sm py-2.5">Belum Dimulai</button>`);
          } else if (exam.attempt_status === "mengerjakan") {
            $$renderer2.push("<!--[3-->");
            $$renderer2.push(`<a${attr("href", `/siswa/ujian?exam_id=${stringify(exam.id)}`)} class="btn btn-warning w-full justify-center text-xs sm:text-sm py-2.5 shadow-md">Lanjutkan Ujian</a>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<a${attr("href", `/siswa/ujian?exam_id=${stringify(exam.id)}`)} class="btn btn-primary w-full justify-center text-xs sm:text-sm py-2.5 shadow-md">Buka Halaman Ujian</a>`);
          }
          $$renderer2.push(`<!--]--></div></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="py-10 px-4 text-center bg-slate-50/70 rounded-xl border border-dashed border-slate-200"><div class="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center text-slate-400 mb-3 shadow-xs border border-slate-100"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.calendar)}></path></svg></div> <h4 class="font-bold text-slate-800 text-sm mb-1">Tidak Ada Ujian</h4> <p class="text-xs text-slate-500 max-w-xs mx-auto mb-4">Tidak ada jadwal ujian pada tanggal yang dipilih. Silakan klik tanggal lain yang bertanda titik untuk melihat jadwal ujian.</p> <button type="button" class="btn btn-outline btn-sm text-xs">Lihat Jadwal Terdekat</button></div>`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (unscheduledExams.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4"><div class="flex items-center gap-2 mb-2"><svg class="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.warning)}></path></svg> <h4 class="font-bold text-amber-900 text-xs sm:text-sm">Jadwal Belum Ditentukan (${escape_html(unscheduledExams.length)})</h4></div> <div class="space-y-2"><!--[-->`);
        const each_array_5 = ensure_array_like(unscheduledExams);
        for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
          let exam = each_array_5[$$index_5];
          $$renderer2.push(`<div class="bg-white p-2.5 rounded-lg border border-amber-100 text-xs flex items-center justify-between gap-2"><div><p class="font-bold text-slate-800">${escape_html(exam.title)}</p> <p class="text-slate-500">${escape_html(exam.subject_code || exam.subject || "Umum")}</p></div> <span class="badge-secondary text-[10px]">Menunggu Jadwal</span></div>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
