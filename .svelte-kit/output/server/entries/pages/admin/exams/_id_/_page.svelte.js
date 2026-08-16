import { m as fallback, h as head, k as attr, c as stringify, e as escape_html, j as attr_class, i as ensure_array_like, l as clsx, f as bind_props } from "../../../../../chunks/index.js";
import { p as parseDate } from "../../../../../chunks/date.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import "../../../../../chunks/state.svelte.js";
import { C as ConfirmForm } from "../../../../../chunks/ConfirmForm.js";
import { Q as QUESTION_TYPE_LABELS, A as ATTEMPT_STATUS_COLORS, a as ATTEMPT_STATUS_LABELS, I as ICONS } from "../../../../../chunks/constants.js";
import "katex/dist/contrib/auto-render.mjs";
import { t as toasts } from "../../../../../chunks/toast.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let exam, questions, attempts, tokens, participants, examTeachers, examProctors, examSessions, hasSessionsOrRooms;
    let form = fallback($$props["form"], null);
    let data = $$props["data"];
    let studentSearch = "";
    let isSavingProctors = false;
    let isSavingParticipants = false;
    exam = data.exam;
    questions = data.questions;
    attempts = data.attempts;
    tokens = data.tokens;
    participants = data.participants;
    data.allTeachers;
    examTeachers = data.examTeachers;
    examProctors = data.examProctors;
    examSessions = data.examSessions || [];
    hasSessionsOrRooms = data.hasSessions || data.examRooms && data.examRooms.length > 0;
    data.allStudents ? data.allStudents.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.username.toLowerCase().includes(studentSearch.toLowerCase());
      const matchesClass = true;
      return matchesSearch && matchesClass;
    }) : [];
    if (form?.success) toasts.success(form.success);
    if (form?.error) toasts.error(form.error);
    head("wh8cpz", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(exam.title)} — Detail Ujian</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="flex items-center justify-between gap-3"><a${attr("href", exam.class_id ? `/admin/exams/type/${exam.exam_type_id}/class/${exam.class_id}` : `/admin/exams/type/${exam.exam_type_id}`)} class="btn-ghost btn-sm"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronLeft)}></path></svg> Kembali</a> <div class="relative group"><button class="btn-outline btn-sm flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak &amp; Export <svg class="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg></button> <div class="absolute right-0 mt-1 w-56 bg-white border border-slate-100 rounded-xl shadow-lg shadow-slate-200/50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20"><a${attr("href", `/print/jadwal-rekap/type/${stringify(exam.exam_type_id)}${exam.class_id ? `?class_id=${exam.class_id}` : ""}`)} target="_blank" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> Cetak Jadwal Ujian</a> <a${attr("href", `/print/kehadiran/${stringify(exam.id)}`)} target="_blank" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg> Cetak Daftar Hadir</a> <a${attr("href", `/print/berita-acara/${stringify(exam.id)}`)} target="_blank" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Cetak Berita Acara</a> <div class="h-px bg-slate-100 my-1"></div> <a${attr("href", `/api/export/excel/${stringify(exam.id)}`)} class="flex items-center gap-3 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"><svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Export Nilai (Excel)</a></div></div></div> <div class="card p-6"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div>`);
    if (exam.exam_type_code) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex items-center gap-2 mb-1"><span class="text-xs font-mono font-bold tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">${escape_html(exam.exam_type_code)}</span></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <h1 class="text-2xl font-bold text-slate-800">${escape_html(exam.title)}</h1> <p class="text-sm text-slate-500 mt-1">${escape_html(exam.subject_name || exam.subject || "Umum")} · ${escape_html(exam.duration_minutes)} menit</p></div> <div class="flex items-center gap-3">`);
    if (exam.show_score_type === "manual") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<form method="POST" action="?/toggleScoreRelease"><button type="submit"${attr_class(`flex items-center gap-2 px-3 py-1.5 rounded-full border ${exam.is_score_released ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-slate-50 border-slate-200 text-slate-500"} transition-colors`)} title="Klik untuk mengubah status rilis nilai manual"><div${attr_class(`relative inline-flex h-4 w-7 items-center rounded-full ${exam.is_score_released ? "bg-indigo-500" : "bg-slate-300"} transition-colors`)}><span${attr_class(`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${exam.is_score_released ? "translate-x-3.5" : "translate-x-0.5"}`)}></span></div> <span class="text-xs font-semibold">${escape_html(exam.is_score_released ? "Nilai Dirilis" : "Nilai Disembunyikan")}</span></button></form>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (exam.is_active) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="badge-success text-sm px-4 py-1.5">Aktif</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span class="badge bg-slate-100 text-slate-500 text-sm px-4 py-1.5">Nonaktif</span>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (exam.description) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-3 text-sm text-slate-600">${escape_html(exam.description)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 items-center">`);
    if (examSessions.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="w-full flex flex-wrap gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-1"><span class="text-slate-600 font-semibold flex items-center gap-1 mr-1"><svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path></svg> Jadwal Per Sesi:</span> <div class="flex flex-wrap gap-2"><!--[-->`);
      const each_array = ensure_array_like(examSessions);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let session = each_array[$$index];
        $$renderer2.push(`<span class="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded border border-slate-200 text-xs shadow-xs"><strong class="text-indigo-600 font-bold">Sesi ${escape_html(session.session_number)}:</strong> <span class="text-slate-700 font-medium">${escape_html(session.start_time ? parseDate(session.start_time).toLocaleString("id-ID") : "-")} <span class="text-slate-400 mx-0.5">s/d</span> ${escape_html(session.end_time ? parseDate(session.end_time).toLocaleString("id-ID") : "-")}</span></span>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path></svg> Mulai: <strong class="text-slate-600 font-medium">${escape_html(exam.start_time ? parseDate(exam.start_time).toLocaleString("id-ID") : "-")}</strong></span> <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path></svg> Selesai: <strong class="text-slate-600 font-medium">${escape_html(exam.end_time ? parseDate(exam.end_time).toLocaleString("id-ID") : "-")}</strong></span>`);
    }
    $$renderer2.push(`<!--]--> <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7"></path></svg> Tampilan Soal: <strong class="text-slate-600 font-medium">${escape_html(exam.shuffle_questions ? "Acak" : "Tidak Acak")}</strong></span> <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Tampilan Nilai: <strong class="text-slate-600 font-medium">${escape_html({
      after_type_end_time: "Jadwal Tipe Ujian",
      after_submit: "Langsung Tampil",
      after_end_time: "Jadwal Ujian",
      objective_only: "Hanya Nilai Otomatis",
      manual: "Manual (Guru/Admin)"
    }[exam.show_score_type || "after_submit"] || "Langsung Tampil")}</strong></span></div></div> <div class="grid grid-cols-2 md:grid-cols-5 gap-4"><div class="card p-4 text-center"><p class="text-2xl font-bold text-gradient">${escape_html(questions.length)}</p> <p class="text-xs text-slate-500">Soal</p></div> <div class="card p-4 text-center"><p class="text-2xl font-bold text-gradient-cyan">${escape_html(participants.length)}</p> <p class="text-xs text-slate-500">Peserta</p></div> <div class="card p-4 text-center"><p class="text-2xl font-bold text-amber-500">${escape_html(tokens.length)}</p> <p class="text-xs text-slate-500">Token</p></div> <div class="card p-4 text-center"><p class="text-2xl font-bold text-indigo-500">${escape_html(examTeachers.length)}</p> <p class="text-xs text-slate-500">Guru</p></div> <div class="card p-4 text-center col-span-2 md:col-span-1"><p class="text-2xl font-bold text-rose-500">${escape_html(examProctors.length)}</p> <p class="text-xs text-slate-500">Pengawas</p></div></div> <div class="card overflow-hidden mb-6"><div class="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3"><div><h2 class="text-lg font-bold text-slate-800">Manajemen Ruang</h2> <p class="text-xs text-slate-500 mt-0.5">Bagi peserta dan pengawas ke dalam beberapa ruang (opsional).</p></div> <form method="POST" action="?/addRoom" class="flex items-center gap-2"><input type="text" name="name" class="input py-1.5 text-sm w-48" placeholder="Nama Ruang (cth: LAB 1)" required=""/> <button type="submit" class="btn-sm btn-primary shrink-0">Tambah Ruang</button></form></div> `);
    if (data.examRooms.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-6 text-center text-slate-400 text-sm">Tidak ada pembagian ruang. Semua peserta berada dalam 1 ruang default.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"><!--[-->`);
      const each_array_1 = ensure_array_like(data.examRooms);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let room = each_array_1[$$index_1];
        $$renderer2.push(`<div class="border border-slate-100 rounded-lg p-3 bg-slate-50 flex items-center justify-between"><div class="font-medium text-slate-700 text-sm">${escape_html(room.name)}</div> `);
        ConfirmForm($$renderer2, {
          action: "?/deleteRoom",
          confirmTitle: "Hapus Ruang",
          confirmMessage: "Hapus ruang ujian ini? Peserta dan pengawas di ruang ini tidak akan memiliki ruang yang spesifik.",
          buttonClass: "text-rose-500 hover:text-rose-700 p-1",
          buttonTitle: "Hapus",
          $$slots: {
            inputs: ($$renderer3) => {
              {
                $$renderer3.push(`<input type="hidden" name="room_id"${attr("value", room.id)}/>`);
              }
            },
            buttonContent: ($$renderer3) => {
              {
                $$renderer3.push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.trash)}></path></svg>`);
              }
            }
          }
        });
        $$renderer2.push(`<!----></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="card overflow-hidden mb-6"><div class="p-5 border-b border-slate-100 flex items-center justify-between"><div><h2 class="text-lg font-bold text-slate-800">Daftar Pengajar</h2> <p class="text-xs text-slate-500 mt-0.5">Guru yang diizinkan mengelola bank soal untuk ujian ini.</p></div> <button class="btn-sm btn-primary"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.plus)}></path></svg> Tambah Pengajar</button></div> `);
    if (examTeachers.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-8 text-center text-slate-400 text-sm">Belum ada pengajar tambahan. Hanya pembuat ujian yang dapat mengelola soal.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="table-container border-0 rounded-none"><table class="table"><thead><tr><th>Nama Guru</th><th>Username</th><th>Aksi</th></tr></thead><tbody><!--[-->`);
      const each_array_2 = ensure_array_like(examTeachers);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let teacher = each_array_2[$$index_2];
        $$renderer2.push(`<tr><td class="font-medium text-slate-800">${escape_html(teacher.name)}</td><td class="font-mono text-sm text-slate-500">${escape_html(teacher.username)}</td><td>`);
        ConfirmForm($$renderer2, {
          action: "?/removeTeacher",
          confirmTitle: "Hapus Pengajar",
          confirmMessage: "Hapus pengajar ini?",
          buttonClass: "text-rose-500 hover:text-rose-700 p-1",
          buttonTitle: "Hapus Pengajar",
          $$slots: {
            inputs: ($$renderer3) => {
              {
                $$renderer3.push(`<input type="hidden" name="exam_teacher_id"${attr("value", teacher.exam_teacher_id)}/>`);
              }
            },
            buttonContent: ($$renderer3) => {
              {
                $$renderer3.push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.trash)}></path></svg>`);
              }
            }
          }
        });
        $$renderer2.push(`<!----></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="card overflow-hidden mb-6"><div class="p-5 border-b border-slate-100 flex items-center justify-between"><div><h2 class="text-lg font-bold text-slate-800">Daftar Pengawas Ujian</h2> <p class="text-xs text-slate-500 mt-0.5">Tentukan penetapan pengawas, sesi, dan ruang mengawas untuk setiap pengawas.</p></div> <div class="flex items-center gap-2">`);
    if (examProctors.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button type="submit" form="proctors-form"${attr("disabled", isSavingProctors, true)} class="btn-sm btn-primary flex items-center gap-1.5 shadow-sm">`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> Simpan Pengawas`);
      }
      $$renderer2.push(`<!--]--></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button class="btn-sm btn-secondary flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.plus)}></path></svg> Tambah Pengawas</button></div></div> `);
    if (examProctors.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-8 text-center text-slate-400 text-sm">Belum ada pengawas yang ditugaskan untuk ujian ini.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<form id="proctors-form" method="POST" action="?/updateAllProctors"><div class="table-container border-0 rounded-none max-h-80 overflow-y-auto"><table class="table"><thead class="sticky top-0 bg-white z-10"><tr><th>Nama Pengawas</th><th>Username</th><th>Penetapan Peran</th>`);
      if (data.hasSessions) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<th>Sesi Mengawas</th>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
      if (data.examRooms.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<th>Ruang Ujian</th>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--><th class="w-16">Aksi</th></tr></thead><tbody><!--[-->`);
      const each_array_3 = ensure_array_like(examProctors);
      for (let $$index_5 = 0, $$length = each_array_3.length; $$index_5 < $$length; $$index_5++) {
        let proctor = each_array_3[$$index_5];
        $$renderer2.push(`<tr><td class="font-medium text-slate-800"><input type="hidden" name="exam_proctor_ids"${attr("value", proctor.exam_proctor_id)}/> ${escape_html(proctor.name)}</td><td class="font-mono text-sm text-slate-500">${escape_html(proctor.username)}</td><td>`);
        $$renderer2.select(
          {
            name: `role_${proctor.exam_proctor_id}`,
            class: "select select-sm select-bordered w-full max-w-[150px]",
            value: proctor.proctor_role === "p2" ? "p2" : "p1"
          },
          ($$renderer3) => {
            $$renderer3.option({ value: "p1" }, ($$renderer4) => {
              $$renderer4.push(`Pengawas 1`);
            });
            $$renderer3.option({ value: "p2" }, ($$renderer4) => {
              $$renderer4.push(`Pengawas 2`);
            });
          }
        );
        $$renderer2.push(`</td>`);
        if (data.hasSessions) {
          $$renderer2.push("<!--[0-->");
          const sessionsArr = proctor.sessions ? JSON.parse(proctor.sessions) : [];
          $$renderer2.push(`<td><div class="flex flex-wrap gap-2.5 items-center"><!--[-->`);
          const each_array_4 = ensure_array_like(Array(data.sessionsCount));
          for (let i = 0, $$length2 = each_array_4.length; i < $$length2; i++) {
            each_array_4[i];
            const sNum = i + 1;
            $$renderer2.push(`<label class="flex items-center gap-1.5 cursor-pointer bg-slate-50 hover:bg-indigo-50 px-2 py-1 rounded border border-slate-200 hover:border-indigo-200 transition-colors"><input type="checkbox"${attr("name", `sessions_${proctor.exam_proctor_id}`)}${attr("value", sNum)}${attr("checked", sessionsArr.includes(sNum), true)} class="w-3.5 h-3.5 text-indigo-600 rounded focus:ring-indigo-500"/> <span class="text-xs font-medium text-slate-700">Sesi ${escape_html(sNum)}</span></label>`);
          }
          $$renderer2.push(`<!--]--></div></td>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]-->`);
        if (data.examRooms.length > 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<td><select${attr("name", `room_${proctor.exam_proctor_id}`)} class="select select-sm select-bordered w-full max-w-[140px]">`);
          $$renderer2.option({ value: "" }, ($$renderer3) => {
            $$renderer3.push(`- Semua Ruang -`);
          });
          $$renderer2.push(`<!--[-->`);
          const each_array_5 = ensure_array_like(data.examRooms);
          for (let $$index_4 = 0, $$length2 = each_array_5.length; $$index_4 < $$length2; $$index_4++) {
            let room = each_array_5[$$index_4];
            $$renderer2.option({ value: room.id, selected: proctor.room_id === room.id }, ($$renderer3) => {
              $$renderer3.push(`${escape_html(room.name)}`);
            });
          }
          $$renderer2.push(`<!--]--></select></td>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--><td>`);
        ConfirmForm($$renderer2, {
          action: "?/removeProctor",
          confirmTitle: "Hapus Pengawas",
          confirmMessage: "Hapus pengawas ini?",
          buttonClass: "text-rose-500 hover:text-rose-700 p-1",
          buttonTitle: "Hapus Pengawas",
          $$slots: {
            inputs: ($$renderer3) => {
              {
                $$renderer3.push(`<input type="hidden" name="exam_proctor_id"${attr("value", proctor.exam_proctor_id)}/>`);
              }
            },
            buttonContent: ($$renderer3) => {
              {
                $$renderer3.push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.trash)}></path></svg>`);
              }
            }
          }
        });
        $$renderer2.push(`<!----></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div></form>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="card overflow-hidden mb-6"><div class="p-5 border-b border-slate-100 flex items-center justify-between"><div><h2 class="text-lg font-bold text-slate-800">Daftar Peserta Ujian</h2> <p class="text-xs text-slate-500 mt-0.5">Tentukan sesi dan ruang untuk peserta ujian.</p></div> <div class="flex items-center gap-2">`);
    if (participants.length > 0 && hasSessionsOrRooms) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button type="submit" form="participants-form"${attr("disabled", isSavingParticipants, true)} class="btn-sm btn-primary flex items-center gap-1.5 shadow-sm">`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> Simpan Sesi &amp; Ruang Peserta`);
      }
      $$renderer2.push(`<!--]--></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button class="btn-sm btn-secondary flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.plus)}></path></svg> Tambah Peserta</button></div></div> `);
    if (participants.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-8 text-center text-slate-400 text-sm">Belum ada peserta yang ditambahkan ke ujian ini. Ujian tidak bisa diakses siswa.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<form id="participants-form" method="POST" action="?/updateAllParticipants"><div class="table-container border-0 rounded-none max-h-96 overflow-y-auto"><table class="table"><thead class="sticky top-0 bg-white z-10"><tr><th>NISN</th><th>Nama Siswa</th><th>Kelas</th>`);
      if (data.hasSessions) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<th>Sesi</th>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
      if (data.examRooms.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<th>Ruang</th>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--><th class="w-16">Aksi</th></tr></thead><tbody><!--[-->`);
      const each_array_6 = ensure_array_like(participants);
      for (let $$index_8 = 0, $$length = each_array_6.length; $$index_8 < $$length; $$index_8++) {
        let p = each_array_6[$$index_8];
        $$renderer2.push(`<tr><td class="text-xs font-mono"><input type="hidden" name="participant_ids"${attr("value", p.participant_id)}/> <input type="hidden" name="user_ids"${attr("value", p.user_id)}/> ${escape_html(p.nisn)}</td><td class="font-medium">${escape_html(p.student_name)}</td><td>${escape_html(p.class_name || "-")}</td>`);
        if (data.hasSessions) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<td><select${attr("name", `session_${p.user_id}`)} class="select select-sm select-bordered w-full max-w-[120px]"><!--[-->`);
          const each_array_7 = ensure_array_like(Array(data.sessionsCount));
          for (let i = 0, $$length2 = each_array_7.length; i < $$length2; i++) {
            each_array_7[i];
            $$renderer2.option({ value: i + 1, selected: p.session_number === i + 1 }, ($$renderer3) => {
              $$renderer3.push(`Sesi ${escape_html(i + 1)}`);
            });
          }
          $$renderer2.push(`<!--]--></select></td>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]-->`);
        if (data.examRooms.length > 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<td><select${attr("name", `room_${p.participant_id}`)} class="select select-sm select-bordered w-full max-w-[120px]">`);
          $$renderer2.option({ value: "" }, ($$renderer3) => {
            $$renderer3.push(`- Default -`);
          });
          $$renderer2.push(`<!--[-->`);
          const each_array_8 = ensure_array_like(data.examRooms);
          for (let $$index_7 = 0, $$length2 = each_array_8.length; $$index_7 < $$length2; $$index_7++) {
            let room = each_array_8[$$index_7];
            $$renderer2.option({ value: room.id, selected: p.room_id === room.id }, ($$renderer3) => {
              $$renderer3.push(`${escape_html(room.name)}`);
            });
          }
          $$renderer2.push(`<!--]--></select></td>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--><td>`);
        ConfirmForm($$renderer2, {
          action: "?/removeParticipant",
          confirmTitle: "Hapus Siswa dari Ujian",
          confirmMessage: "Hapus siswa ini dari ujian?",
          buttonClass: "text-rose-500 hover:text-rose-700 p-1",
          buttonTitle: "Hapus dari ujian",
          $$slots: {
            inputs: ($$renderer3) => {
              {
                $$renderer3.push(`<input type="hidden" name="participant_id"${attr("value", p.participant_id)}/>`);
              }
            },
            buttonContent: ($$renderer3) => {
              {
                $$renderer3.push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.trash)}></path></svg>`);
              }
            }
          }
        });
        $$renderer2.push(`<!----></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div></form>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="card overflow-hidden mb-6"><div class="p-5 border-b border-slate-100 flex items-center justify-between"><h2 class="text-lg font-bold text-slate-800">Daftar Soal</h2> <div class="flex items-center gap-3"><a${attr("href", `/admin/exams/${stringify(exam.id)}/analisis`)} class="btn-sm btn-outline text-indigo-600 border-indigo-200 hover:bg-indigo-50">Analisis Butir Soal</a> <a${attr("href", `/admin/bank-soal/${stringify(exam.id)}`)} class="btn-sm btn-primary">Kelola Soal</a></div></div> `);
    if (questions.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-8 text-center text-slate-400 text-sm">Belum ada soal untuk ujian ini.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="divide-y divide-slate-100"><!--[-->`);
      const each_array_9 = ensure_array_like(questions.slice(0, 5));
      for (let $$index_9 = 0, $$length = each_array_9.length; $$index_9 < $$length; $$index_9++) {
        let q = each_array_9[$$index_9];
        $$renderer2.push(`<div class="p-4 flex items-center gap-3"><span class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">${escape_html(q.question_number)}</span> <div class="flex-1 min-w-0"><p class="text-sm text-slate-700 truncate">${escape_html(q.question_text)}</p> <span class="text-[10px] badge-primary mt-0.5">${escape_html(QUESTION_TYPE_LABELS[q.type] || q.type)}</span></div> <span class="text-xs text-slate-400">${escape_html(q.points)} poin</span></div>`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (questions.length > 5) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-600"><span>Menampilkan 5 dari <strong>${escape_html(questions.length)}</strong> soal (masih ada <strong>${escape_html(questions.length - 5)}</strong> soal lagi).</span> <a${attr("href", `/admin/bank-soal/${stringify(exam.id)}`)} class="text-indigo-600 hover:text-indigo-800 font-semibold text-xs flex items-center gap-1 hover:underline">Buka Kelola Soal <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg></a></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> <div class="card overflow-hidden"><div class="p-5 border-b border-slate-100"><h2 class="text-lg font-bold text-slate-800">Riwayat Pengerjaan</h2></div> `);
    if (attempts.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-8 text-center text-slate-400 text-sm">Belum ada peserta yang mengerjakan ujian ini.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="table-container border-0 rounded-none"><table class="table"><thead><tr><th>Siswa</th><th>Status</th><th>Nilai</th><th>Waktu Mulai</th><th>TTD</th></tr></thead><tbody><!--[-->`);
      const each_array_10 = ensure_array_like(attempts);
      for (let $$index_10 = 0, $$length = each_array_10.length; $$index_10 < $$length; $$index_10++) {
        let a = each_array_10[$$index_10];
        $$renderer2.push(`<tr><td class="font-medium">${escape_html(a.student_name)}</td><td><span${attr_class(clsx(ATTEMPT_STATUS_COLORS[a.status] || "badge-info"))}>${escape_html(ATTEMPT_STATUS_LABELS[a.status] || a.status)}</span></td><td class="font-semibold">${escape_html(a.score != null ? a.score : "-")}</td><td class="text-xs text-slate-500">${escape_html(parseDate(a.start_time).toLocaleString("id-ID"))}</td><td>`);
        if (a.signature) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<img${attr("src", a.signature)}${attr("alt", `TTD ${stringify(a.student_name)}`)} class="h-8 object-contain bg-white rounded border border-slate-200 p-0.5"/>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="text-xs text-slate-400 italic">-</span>`);
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
    bind_props($$props, { form, data });
  });
}
export {
  _page as default
};
