import { h as head, i as attr, e as escape_html, a as stringify, c as ensure_array_like, d as attr_class, f as attr_style, b as bind_props } from "../../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import "../../../../../chunks/state.svelte.js";
import { A as ATTEMPT_STATUS_COLORS, a as ATTEMPT_STATUS_LABELS, I as ICONS } from "../../../../../chunks/constants.js";
import { C as ConfirmForm } from "../../../../../chunks/ConfirmForm.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let exam, participants, allStudents, activeToken, attempts;
    let data = $$props["data"];
    let searchTerm = "";
    let currentTime = Date.now();
    function isTokenExpired(expiresAt) {
      return new Date(expiresAt).getTime() < currentTime;
    }
    function getCountdownString(expiresAt, currentMs) {
      const diff = new Date(expiresAt).getTime() - currentMs;
      if (diff <= 0) return "Kadaluwarsa";
      const h = Math.floor(diff / (1e3 * 60 * 60));
      const m = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      const s = Math.floor(diff % (1e3 * 60) / 1e3);
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    exam = data.exam;
    participants = data.participants;
    allStudents = data.allStudents;
    activeToken = data.activeToken;
    attempts = data.attempts;
    allStudents.filter((s) => !participants.some((p) => p.student_name === s.name) && (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.nisn.includes(searchTerm) || s.class_name && s.class_name.toLowerCase().includes(searchTerm.toLowerCase())));
    head("uomqmn", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Kelola Remedial - ${escape_html(exam.title)}</title>`);
      });
    });
    $$renderer2.push(`<div class="mb-6 flex items-center justify-between animate-in"><div class="flex items-center gap-3"><a href="/guru/remedial" class="btn-sm btn-ghost p-2 text-slate-400 hover:text-slate-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronLeft)}></path></svg></a> <div><h1 class="text-2xl font-bold text-slate-800">${escape_html(exam.title)}</h1> <p class="text-slate-500 text-sm mt-1">${escape_html(exam.subject_name || "Tanpa Mata Pelajaran")} • Durasi: ${escape_html(exam.duration_minutes)} menit</p></div></div> <a${attr("href", `/guru/bank-soal/${stringify(exam.id)}`)} class="btn btn-outline"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.questions)}></path></svg> Soal Ujian</a></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in" style="animation-delay: 50ms;"><div class="space-y-6"><div class="card overflow-hidden"><div class="bg-indigo-600 p-6 text-white text-center relative overflow-hidden"><div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 20px 20px;"></div> <h2 class="text-indigo-100 font-medium text-sm mb-2 relative z-10">TOKEN UJIAN AKTIF</h2> `);
    if (activeToken && !isTokenExpired(activeToken.expires_at)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="text-5xl font-mono font-bold tracking-widest mb-3 relative z-10 drop-shadow-md">${escape_html(activeToken.token)}</div> <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium"><svg class="w-4 h-4 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.clock)}></path></svg> ${escape_html(getCountdownString(activeToken.expires_at, currentTime))}</div> <div class="mt-6 relative z-10 flex justify-center">`);
      ConfirmForm($$renderer2, {
        action: "?/deleteToken",
        confirmTitle: "Cabut Token",
        confirmMessage: "Yakin ingin mencabut token ini? Siswa tidak akan bisa masuk ujian lagi menggunakan token ini.",
        buttonClass: "btn-sm bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm",
        buttonTitle: "Cabut Token",
        $$slots: {
          inputs: ($$renderer3) => {
            {
              $$renderer3.push(`<input type="hidden" name="id"${attr("value", activeToken.id)}/>`);
            }
          },
          buttonContent: ($$renderer3) => {
            {
              $$renderer3.push(`Cabut Token Saat Ini`);
            }
          }
        }
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="text-2xl font-bold mb-4 relative z-10 opacity-80 mt-2">Belum Ada Token</div> <form method="POST" action="?/generateToken" class="relative z-10 mt-6 bg-white/10 p-4 rounded-xl backdrop-blur-sm"><div class="flex gap-2"><button type="submit" class="btn w-full bg-white text-indigo-600 hover:bg-indigo-50 border-0 shadow-lg shadow-black/10">Buat Token (Berlaku 15 Menit)</button></div></form>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="card p-5"><h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2"><svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.calendar)}></path></svg> Jadwal &amp; Pengaturan</h3> <div class="space-y-3 text-sm"><div class="flex justify-between py-2 border-b border-slate-50"><span class="text-slate-500">Mulai</span> <span class="font-medium text-slate-700">${escape_html(exam.start_time ? (/* @__PURE__ */ new Date(String(exam.start_time).replace(" ", "T") + (String(exam.start_time).includes("Z") ? "" : "Z"))).toLocaleString("id-ID") : "-")}</span></div> <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-slate-500">Selesai</span> <span class="font-medium text-slate-700">${escape_html(exam.end_time ? (/* @__PURE__ */ new Date(String(exam.end_time).replace(" ", "T") + (String(exam.end_time).includes("Z") ? "" : "Z"))).toLocaleString("id-ID") : "-")}</span></div> <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-slate-500">Soal Diacak</span> <span class="font-medium text-slate-700">${escape_html(exam.shuffle_questions ? "Ya" : "Tidak")}</span></div> <div class="flex justify-between py-2"><span class="text-slate-500">Rilis Nilai</span> <span class="font-medium text-slate-700">${escape_html(exam.show_score_type === "manual" ? "Manual" : "Otomatis")}</span></div></div></div></div> <div class="lg:col-span-2 space-y-6"><div class="card overflow-hidden flex flex-col h-[400px]"><div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50"><h2 class="text-lg font-bold text-slate-800 flex items-center gap-2"><span class="relative flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span> <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span> Live Monitoring</h2></div> <div class="flex-1 overflow-y-auto p-0">`);
    if (attempts.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="h-full flex flex-col items-center justify-center text-slate-400 p-8"><svg class="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"${attr("d", ICONS.monitor)}></path></svg> <p class="text-sm">Belum ada siswa yang sedang/sudah mengerjakan ujian ini.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<table class="table w-full"><thead class="sticky top-0 bg-white shadow-sm z-10"><tr><th class="pl-5">Siswa</th><th>Waktu Mulai</th><th>Status</th><th class="text-center">Pelanggaran</th><th>Progres</th><th class="text-xs">Sisa Waktu</th><th class="text-right pr-5">Aksi</th></tr></thead><tbody><!--[-->`);
      const each_array = ensure_array_like(attempts);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let attempt = each_array[$$index];
        $$renderer2.push(`<tr class="hover:bg-slate-50"><td class="pl-5"><div class="font-bold text-slate-800">${escape_html(attempt.student_name)}</div> <div class="text-xs text-slate-500">${escape_html(attempt.class_name || "-")}</div></td><td class="text-xs font-mono text-slate-600">${escape_html((/* @__PURE__ */ new Date(String(attempt.start_time).replace(" ", "T") + (String(attempt.start_time).includes("Z") ? "" : "Z"))).toLocaleTimeString("id-ID"))}</td><td><span${attr_class(`badge ${stringify(ATTEMPT_STATUS_COLORS[attempt.status] || "badge-slate")}`)}>${escape_html(ATTEMPT_STATUS_LABELS[attempt.status] || attempt.status)}</span></td><td class="text-center">`);
        if (attempt.warnings > 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="flex items-center justify-center gap-1"><span class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-xs">${escape_html(attempt.warnings)} kali</span> `);
          if (attempt.warningLogs && attempt.warningLogs.length > 0) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<button class="btn-ghost btn-sm p-1 rounded-full text-slate-400 hover:text-slate-600"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></button>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="text-slate-400 text-xs">-</span>`);
        }
        $$renderer2.push(`<!--]--></td><td class="w-32">`);
        if (attempt.question_count > 0) {
          $$renderer2.push("<!--[0-->");
          const pct = Math.round(attempt.answeredCount / attempt.question_count * 100);
          const color = pct < 30 ? "bg-slate-300" : pct < 60 ? "bg-rose-400" : pct < 90 ? "bg-amber-400" : "bg-emerald-500";
          $$renderer2.push(`<div class="flex items-center gap-2"><div class="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden"><div${attr_class(`h-full ${color} transition-all duration-500`)}${attr_style(`width: ${stringify(pct)}%`)}></div></div> <span class="text-xs font-semibold text-slate-600 w-8 text-right">${escape_html(pct)}%</span></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="text-xs text-slate-400">0%</span>`);
        }
        $$renderer2.push(`<!--]--></td><td class="text-xs">`);
        if (attempt.status === "mengerjakan") {
          $$renderer2.push("<!--[0-->");
          const startStr = attempt.start_time.replace(" ", "T") + (attempt.start_time.includes("Z") ? "" : "Z");
          const start = new Date(startStr).getTime();
          const end = start + exam.duration_minutes * 60 * 1e3;
          const remainingMs = end - currentTime;
          if (remainingMs > 0) {
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
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span class="text-rose-500 font-bold">Habis</span>`);
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[-1-->");
          const startStr = attempt.start_time.replace(" ", "T") + (attempt.start_time.includes("Z") ? "" : "Z");
          const submitStr = attempt.submit_time ? attempt.submit_time.replace(" ", "T") + (attempt.submit_time.includes("Z") ? "" : "Z") : startStr;
          const start = new Date(startStr).getTime();
          const submit = new Date(submitStr).getTime();
          const end = start + exam.duration_minutes * 60 * 1e3;
          const remainingMs = end - submit;
          if (remainingMs > 0) {
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
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span class="text-slate-400 font-medium opacity-80">Habis</span>`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></td><td class="text-right pr-5">`);
        if (attempt.status === "mengerjakan") {
          $$renderer2.push("<!--[0-->");
          ConfirmForm($$renderer2, {
            action: "?/forceSubmit",
            confirmTitle: "Paksa Selesai?",
            confirmMessage: `Jawaban ${stringify(attempt.student_name)} sejauh ini akan tersimpan permanen.`,
            buttonClass: "btn-sm btn-ghost text-rose-500 hover:bg-rose-50",
            buttonTitle: "Hentikan pengerjaan siswa",
            $$slots: {
              inputs: ($$renderer3) => {
                {
                  $$renderer3.push(`<input type="hidden" name="attempt_id"${attr("value", attempt.id)}/>`);
                }
              },
              buttonContent: ($$renderer3) => {
                {
                  $$renderer3.push(`Paksa Selesai`);
                }
              }
            }
          });
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="text-xs text-slate-400">-</span>`);
        }
        $$renderer2.push(`<!--]--></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="card overflow-hidden"><div class="p-4 border-b border-slate-100 flex items-center justify-between"><h2 class="text-lg font-bold text-slate-800">Daftar Peserta Remedial (${escape_html(participants.length)})</h2> <button class="btn-sm btn-primary"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.plus)}></path></svg> Tambah Siswa</button></div> `);
    if (participants.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-8 text-center text-slate-400 text-sm">Belum ada peserta. Silakan tambahkan siswa yang butuh remedial.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="table-container border-0 rounded-none max-h-80 overflow-y-auto"><table class="table"><thead class="sticky top-0 bg-white z-10"><tr><th class="w-10 text-center">#</th><th>Nama Siswa</th><th>Kelas</th><th class="text-right">Aksi</th></tr></thead><tbody><!--[-->`);
      const each_array_1 = ensure_array_like(participants);
      for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
        let p = each_array_1[i];
        $$renderer2.push(`<tr><td class="text-center text-slate-400 text-sm">${escape_html(i + 1)}</td><td class="font-medium text-slate-700">${escape_html(p.student_name)}</td><td class="text-slate-500">${escape_html(p.class_name || "-")}</td><td class="text-right">`);
        ConfirmForm($$renderer2, {
          action: "?/removeParticipant",
          confirmTitle: "Hapus Peserta",
          confirmMessage: `Keluarkan ${stringify(p.student_name)} dari ujian remedial ini?`,
          buttonClass: "p-1.5 text-slate-400 hover:text-rose-500 rounded hover:bg-rose-50 transition-colors",
          buttonTitle: "Keluarkan siswa",
          $$slots: {
            inputs: ($$renderer3) => {
              {
                $$renderer3.push(`<input type="hidden" name="participant_id"${attr("value", p.participant_id)}/>`);
              }
            },
            buttonContent: ($$renderer3) => {
              {
                $$renderer3.push(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.trash)}></path></svg>`);
              }
            }
          }
        });
        $$renderer2.push(`<!----></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
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
