import { h as head, e as escape_html, k as attr, i as ensure_array_like, j as attr_class, c as stringify, l as clsx, f as bind_props } from "../../../chunks/index.js";
import { A as ATTEMPT_STATUS_COLORS, a as ATTEMPT_STATUS_LABELS, I as ICONS } from "../../../chunks/constants.js";
import { p as parseDate } from "../../../chunks/date.js";
import { p as parseProctors } from "../../../chunks/format.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
import { S as ScoreDisplay } from "../../../chunks/ScoreDisplay.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activeExams, myAttempts, activeAttempt, groupedByType, filteredActiveExams;
    let data = $$props["data"];
    let currentTime = /* @__PURE__ */ new Date();
    onDestroy(() => {
    });
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
    function getCountdownString(startStr, current) {
      const start = parseDate(startStr);
      const diff = start.getTime() - current.getTime();
      if (diff <= 0) return null;
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    function getAttemptRemainingTime(endTimeStr, current, isPaused = false, pausedAtStr = null) {
      const end = parseDate(endTimeStr);
      let diff = 0;
      if (isPaused && pausedAtStr) {
        const paused = parseDate(pausedAtStr);
        diff = end.getTime() - paused.getTime();
      } else {
        diff = end.getTime() - current.getTime();
      }
      if (diff <= 0) return "00:00:00";
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    function isAttemptExpired(endTimeStr, current) {
      const end = parseDate(endTimeStr);
      return current.getTime() >= end.getTime();
    }
    function isExamToday(dateStr) {
      if (!dateStr) return false;
      const date = parseDate(dateStr);
      const today = /* @__PURE__ */ new Date();
      return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }
    function formatOnlyTime(dateStr) {
      if (!dateStr) return "--.--";
      const date = parseDate(dateStr);
      return new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(date).replace(":", ".");
    }
    function getProctorNumbers(namesStr, map) {
      if (!namesStr) return "-";
      const names = namesStr.split("||").map((n) => n.trim()).filter(Boolean);
      if (names.length === 0) return "-";
      const numbers = names.map((n) => map.get(n)).sort((a, b) => (a || 0) - (b || 0));
      return numbers.join(" & ");
    }
    const rowColors = ["bg-white", "bg-slate-50"];
    let searchQuery = "";
    activeExams = (data.activeExams || []).filter((exam) => {
      const now = /* @__PURE__ */ new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (exam.end_time && parseDate(exam.end_time) <= now) return false;
      if (exam.start_time) {
        const start = parseDate(exam.start_time);
        const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        if (startDate > today) return false;
      }
      return true;
    });
    myAttempts = (data.myAttempts || []).filter((a) => {
      const attemptDate = parseDate(a.created_at);
      const today = /* @__PURE__ */ new Date();
      return attemptDate.getDate() === today.getDate() && attemptDate.getMonth() === today.getMonth() && attemptDate.getFullYear() === today.getFullYear();
    });
    activeAttempt = data.activeAttempt;
    groupedByType = (() => {
      const typeGroups = [];
      if (!data.schedules) return typeGroups;
      const typeMap = /* @__PURE__ */ new Map();
      data.schedules.forEach((exam) => {
        const tName = exam.exam_type_name || "Jadwal Ujian";
        if (!typeMap.has(tName)) typeMap.set(tName, []);
        typeMap.get(tName).push(exam);
      });
      typeMap.forEach((exams, typeName) => {
        const days = [];
        const localProctorMap = /* @__PURE__ */ new Map();
        let currentDateStr = "";
        let currentGroup = null;
        let colorCounter = 0;
        let proctorCounter = 1;
        let totalExams = 0;
        exams.forEach((exam) => {
          if (exam.proctor_names) {
            (exam.proctor_names || "").split("||").forEach((p) => {
              const name = p.trim();
              if (name && !localProctorMap.has(name)) {
                localProctorMap.set(name, proctorCounter++);
              }
            });
          }
          if (!exam.start_time) return;
          const date = parseDate(String(exam.start_time));
          const dateFormatted = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
          }).format(date);
          if (dateFormatted !== currentDateStr) {
            currentDateStr = dateFormatted;
            currentGroup = { dateStr: dateFormatted, exams: [], colorIdx: colorCounter++ };
            days.push(currentGroup);
          }
          currentGroup?.exams.push(exam);
          totalExams++;
        });
        if (days.length > 0) {
          typeGroups.push({ typeName, days, proctorMap: localProctorMap, totalExams });
        }
      });
      return typeGroups;
    })();
    filteredActiveExams = activeExams.filter((exam) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = (exam.title || "").toLowerCase().includes(q);
      const subjectMatch = (exam.subject || "").toLowerCase().includes(q);
      const proctorsStr = (exam.proctors || "").toString().toLowerCase();
      return titleMatch || subjectMatch || proctorsStr.includes(q);
    });
    head("1sjgise", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Dashboard Siswa — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div><h1 class="text-2xl font-bold text-slate-800">Dashboard Siswa</h1> <p class="text-sm text-slate-500 mt-1">Selamat datang, ${escape_html(data.user.name)}.</p></div>  <div><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3"><h2 class="text-lg font-bold text-slate-800">Ujian Tersedia Hari Ini</h2> `);
    if (activeExams.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="relative w-full sm:w-64"><input type="text"${attr("value", searchQuery)} placeholder="Cari mapel, pengawas..." class="input pl-10 pr-9 py-1.5 w-full text-xs rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm bg-white"/> <svg class="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (filteredActiveExams.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="card p-8 text-center text-slate-400"><svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg> `);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<p>Tidak ada ujian yang tersedia saat ini.</p>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
      const each_array = ensure_array_like(filteredActiveExams);
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let exam = each_array[$$index_1];
        const inProgressAttempt = activeAttempt && activeAttempt.exam_id === exam.id ? activeAttempt : (data.myAttempts || []).find((a) => a.exam_id === exam.id && a.status === "mengerjakan");
        const isInProgress = !!inProgressAttempt;
        const isFinished = (data.myAttempts || []).some((a) => a.exam_id === exam.id && ["selesai", "waktu_habis", "remedial"].includes(a.status));
        $$renderer2.push(`<div${attr_class(`p-5 flex flex-col h-full rounded-2xl transition-all duration-200 ${isInProgress ? "bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white border-2 border-amber-400 shadow-md shadow-amber-500/10 ring-2 ring-amber-400/20" : "card-hover"}`)}><div class="flex items-start justify-between mb-3"><div${attr_class(`w-10 h-10 rounded-xl ${isInProgress ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-orange-500/20 animate-pulse" : "bg-gradient-to-br from-indigo-500 to-violet-500"} flex items-center justify-center`)}><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">`);
        if (isInProgress) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path>`);
        }
        $$renderer2.push(`<!--]--></svg></div> `);
        if (isInProgress) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 shadow-xs"><span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span> Ujian Sedang Berlangsung</span>`);
        } else if (isFinished) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<span class="badge-success bg-emerald-100 text-emerald-800 border border-emerald-200">Selesai</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="badge-success">Tersedia</span>`);
        }
        $$renderer2.push(`<!--]--></div> <h3${attr_class(`font-bold ${isInProgress ? "text-amber-950" : "text-slate-800"} text-base leading-snug`)}>${escape_html(exam.title)}</h3> <p${attr_class(`text-sm ${isInProgress ? "text-amber-700/80 font-medium" : "text-slate-500"} mt-1 mb-4`)}>${escape_html(exam.subject || "Umum")}</p> <div class="space-y-2 mb-4 mt-auto"><div${attr_class(`flex items-center text-sm ${isInProgress ? "text-amber-900/80" : "text-slate-600"}`)}><svg${attr_class(`w-4 h-4 mr-2 ${isInProgress ? "text-amber-500" : "text-slate-400"} min-w-4`)} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path></svg> <span>Pukul: ${escape_html(formatTimeRange(exam.start_time, exam.end_time))} `);
        if (exam.has_sessions && exam.session_number) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span${attr_class(`text-xs font-semibold px-2 py-0.5 ${isInProgress ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-indigo-50 text-indigo-700 border-indigo-100"} border rounded-md ml-1.5 inline-block`)}>Sesi ${escape_html(exam.session_number)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></span></div> <div${attr_class(`flex items-center text-sm ${isInProgress ? "text-amber-900/80" : "text-slate-600"}`)}><svg${attr_class(`w-4 h-4 mr-2 ${isInProgress ? "text-amber-500" : "text-slate-400"} min-w-4`)} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg> <span>Durasi: ${escape_html(exam.duration_minutes)} menit</span></div> <div${attr_class(`flex items-center text-sm ${isInProgress ? "text-amber-900/80" : "text-slate-600"}`)}><svg${attr_class(`w-4 h-4 mr-2 ${isInProgress ? "text-amber-500" : "text-slate-400"} min-w-4`)} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> <span>Soal: ${escape_html(exam.question_count)}</span></div> <div${attr_class(`flex items-start text-sm ${isInProgress ? "text-amber-900/80" : "text-slate-600"}`)}><svg${attr_class(`w-4 h-4 mr-2 ${isInProgress ? "text-amber-500" : "text-slate-400"} min-w-4 mt-0.5`)} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.users)}></path></svg> <div class="space-y-0.5"><!--[-->`);
        const each_array_1 = ensure_array_like(parseProctors(exam.proctors));
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let p = each_array_1[$$index];
          $$renderer2.push(`<div><span${attr_class(`font-medium ${isInProgress ? "text-amber-950" : "text-slate-700"}`)}>${escape_html(p.label)}:</span> ${escape_html(p.name)}</div>`);
        }
        $$renderer2.push(`<!--]--></div></div></div> <div${attr_class(`pt-4 border-t ${isInProgress ? "border-amber-200/80" : "border-slate-100"} mt-auto`)}>`);
        if (isInProgress) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<a${attr("href", `/siswa/ujian?exam_id=${stringify(exam.id)}`)} class="btn w-full justify-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-orange-500/25 transition-all flex items-center gap-1.5">Lanjutkan <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronRight)}></path></svg></a>`);
        } else if (isFinished) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<button disabled="" class="btn w-full justify-center bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed shadow-none"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> Selesai</button>`);
        } else if (exam.start_time && getCountdownString(exam.start_time, currentTime)) {
          $$renderer2.push("<!--[2-->");
          $$renderer2.push(`<button disabled="" class="btn w-full justify-center bg-slate-800 text-white cursor-not-allowed flex gap-2 border-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_2px_4px_rgba(0,0,0,0.3)]"><svg class="w-5 h-5 animate-spin-slow opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path></svg> <span class="font-mono text-lg tracking-widest font-bold">${escape_html(getCountdownString(exam.start_time, currentTime))}</span></button>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<a${attr("href", `/siswa/ujian?exam_id=${stringify(exam.id)}`)} class="btn btn-primary w-full justify-center shadow-lg shadow-indigo-500/30">Buka Halaman Ujian</a>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (groupedByType.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mt-8 mb-4 space-y-8"><!--[-->`);
      const each_array_2 = ensure_array_like(groupedByType);
      for (let $$index_5 = 0, $$length = each_array_2.length; $$index_5 < $$length; $$index_5++) {
        let typeGroup = each_array_2[$$index_5];
        $$renderer2.push(`<div><h2 class="text-lg font-bold text-slate-800 mb-3">Jadwal ${escape_html(typeGroup.typeName)}</h2> <div class="card overflow-x-auto bg-white !rounded-none !shadow-none border-2 border-slate-300 p-0"><table class="w-full text-sm border-collapse border-slate-300 whitespace-nowrap"><thead><tr class="bg-slate-100 text-slate-700"><th class="border-2 border-slate-300 px-3 py-2 uppercase">NO</th><th class="border-2 border-slate-300 px-3 py-2 uppercase">HARI, TANGGAL</th><th class="border-2 border-slate-300 px-3 py-2 uppercase">JAM KE</th><th class="border-2 border-slate-300 px-3 py-2 uppercase">RUANG</th><th class="border-2 border-slate-300 px-3 py-2 uppercase">SESI</th><th class="border-2 border-slate-300 px-3 py-2 uppercase">WAKTU</th><th class="border-2 border-slate-300 px-3 py-2 uppercase">MATA PELAJARAN</th><th class="border-2 border-slate-300 px-3 py-2 uppercase">STATUS</th><th class="border-2 border-slate-300 px-3 py-2 uppercase">PENGAWAS</th><th class="border-2 border-slate-300 px-3 py-2">Daftar Pengawas</th></tr></thead><tbody><!--[-->`);
        const each_array_3 = ensure_array_like(typeGroup.days);
        for (let gIdx = 0, $$length2 = each_array_3.length; gIdx < $$length2; gIdx++) {
          let group = each_array_3[gIdx];
          $$renderer2.push(`<!--[-->`);
          const each_array_4 = ensure_array_like(group.exams);
          for (let eIdx = 0, $$length3 = each_array_4.length; eIdx < $$length3; eIdx++) {
            let exam = each_array_4[eIdx];
            $$renderer2.push(`<tr${attr_class(rowColors[group.colorIdx % rowColors.length])}>`);
            if (eIdx === 0) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<td class="border-2 border-slate-300 px-3 py-2 text-center"${attr("rowspan", group.exams.length)}>${escape_html(gIdx + 1)}</td> <td class="border-2 border-slate-300 px-3 py-2 text-center"${attr("rowspan", group.exams.length)}>${escape_html(group.dateStr)}</td>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]--><td class="border-2 border-slate-300 px-3 py-2 text-center">${escape_html(eIdx + 1)}</td><td class="border-2 border-slate-300 px-3 py-2 text-center">${escape_html(exam.room_name || "Ruang Ujian")}</td><td class="border-2 border-slate-300 px-3 py-2 text-center">${escape_html(exam.has_sessions ? exam.session_number || 1 : "-")}</td><td class="border-2 border-slate-300 px-3 py-2 text-center tracking-wider">${escape_html(formatOnlyTime(exam.start_time || ""))} - ${escape_html(formatOnlyTime(exam.end_time || ""))}</td><td class="border-2 border-slate-300 px-3 py-2 text-center">${escape_html(exam.subject_name || exam.title || "")}</td><td class="border-2 border-slate-300 px-3 py-2 text-center">`);
            if (exam.attempt_status === "selesai" || exam.attempt_status === "remedial" || exam.attempt_status === "waktu_habis") {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<span class="text-emerald-600 font-bold">Selesai</span>`);
            } else if (exam.attempt_status === "mengerjakan") {
              $$renderer2.push("<!--[1-->");
              $$renderer2.push(`<span class="text-indigo-600 font-bold">Mengerjakan</span>`);
            } else {
              $$renderer2.push("<!--[-1-->");
              if (exam.end_time && isAttemptExpired(exam.end_time, currentTime)) {
                $$renderer2.push("<!--[0-->");
                $$renderer2.push(`<span class="text-rose-600 font-bold">Tidak dikerjakan</span>`);
              } else if (isExamToday(exam.start_time || exam.end_time)) {
                $$renderer2.push("<!--[1-->");
                $$renderer2.push(`<span class="text-emerald-600 font-bold">Hari ini</span>`);
              } else {
                $$renderer2.push("<!--[-1-->");
                $$renderer2.push(`<span class="text-slate-400 font-bold">Belum mulai</span>`);
              }
              $$renderer2.push(`<!--]-->`);
            }
            $$renderer2.push(`<!--]--></td><td class="border-2 border-slate-300 px-3 py-2 text-center font-medium">${escape_html(getProctorNumbers(exam.proctor_names || "", typeGroup.proctorMap))}</td>`);
            if (gIdx === 0 && eIdx === 0) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<td class="border-2 border-slate-300 px-4 py-2 align-top bg-white"${attr("rowspan", typeGroup.totalExams)}><div class="space-y-0.5"><!--[-->`);
              const each_array_5 = ensure_array_like(Array.from(typeGroup.proctorMap.entries()));
              for (let $$index_2 = 0, $$length4 = each_array_5.length; $$index_2 < $$length4; $$index_2++) {
                let [name, num] = each_array_5[$$index_2];
                $$renderer2.push(`<div class="text-xs"><span class="inline-block w-4">${escape_html(num)}.</span> ${escape_html(name)}</div>`);
              }
              $$renderer2.push(`<!--]--></div></td>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]--></tr>`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></tbody></table></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div><h2 class="text-lg font-bold text-slate-800 mb-3">Riwayat Ujian Hari Ini</h2> `);
    if (myAttempts.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="card p-6 text-center text-slate-400 text-sm">Belum ada riwayat ujian.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="card overflow-hidden"><div class="table-container border-0 rounded-none"><table class="table"><thead><tr><th>Ujian</th><th>Mapel</th><th>Status</th><th>Sisa Waktu</th><th>Nilai Otomatis</th><th>Nilai Manual</th><th>Nilai Akhir</th><th>Tanggal</th></tr></thead><tbody><!--[-->`);
      const each_array_6 = ensure_array_like(myAttempts);
      for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
        let a = each_array_6[$$index_6];
        $$renderer2.push(`<tr><td class="font-medium">${escape_html(a.exam_title)}</td><td class="text-slate-500">${escape_html(a.subject || "-")}</td><td><span${attr_class(clsx(ATTEMPT_STATUS_COLORS[a.status]))}>${escape_html(ATTEMPT_STATUS_LABELS[a.status])}</span></td><td class="font-mono text-sm">`);
        if (a.status === "mengerjakan") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="inline-flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path></svg> ${escape_html(getAttemptRemainingTime(a.end_time, currentTime, a.is_paused === 1, a.paused_at))}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          const submitMs = parseDate(a.submit_time || a.updated_at || a.start_time).getTime();
          const endMs = parseDate(a.end_time).getTime();
          const remainingMs = endMs - submitMs;
          if (remainingMs > 0) {
            $$renderer2.push("<!--[0-->");
            const totalS = Math.floor(remainingMs / 1e3);
            const h = Math.floor(totalS / 3600);
            const m = Math.floor(totalS % 3600 / 60);
            const s = totalS % 60;
            $$renderer2.push(`<span class="text-slate-400" title="Sisa waktu saat ujian diselesaikan">${escape_html(h.toString().padStart(2, "0"))}:${escape_html(m.toString().padStart(2, "0"))}:${escape_html(s.toString().padStart(2, "0"))}</span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span class="text-slate-400">00:00:00</span>`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></td><td class="font-bold bg-slate-50/50">`);
        ScoreDisplay($$renderer2, { attempt: a, currentTime, type: "otomatis" });
        $$renderer2.push(`<!----></td><td class="font-bold bg-slate-50/50">`);
        ScoreDisplay($$renderer2, { attempt: a, currentTime, type: "manual" });
        $$renderer2.push(`<!----></td><td class="font-bold bg-indigo-50/30">`);
        ScoreDisplay($$renderer2, { attempt: a, currentTime, type: "akhir" });
        $$renderer2.push(`<!----></td><td class="text-xs text-slate-500">${escape_html(parseDate(a.created_at).toLocaleDateString("id-ID"))}</td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
