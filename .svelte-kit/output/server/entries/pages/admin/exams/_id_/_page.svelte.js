import { h as head, i as attr, e as escape_html, a as stringify, c as ensure_array_like, d as attr_class, j as clsx, b as bind_props } from "../../../../../chunks/index.js";
import { Q as QUESTION_TYPE_LABELS, A as ATTEMPT_STATUS_COLORS, a as ATTEMPT_STATUS_LABELS, I as ICONS } from "../../../../../chunks/constants.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let exam, questions, attempts, tokens;
    let data = $$props["data"];
    exam = data.exam;
    questions = data.questions;
    attempts = data.attempts;
    tokens = data.tokens;
    head("wh8cpz", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(exam.title)} — Detail Ujian</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="flex items-center gap-3"><a href="/admin/exams" class="btn-ghost btn-sm"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronLeft)}></path></svg> Kembali</a></div> <div class="card p-6"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><h1 class="text-2xl font-bold text-slate-800">${escape_html(exam.title)}</h1> <p class="text-sm text-slate-500 mt-1">${escape_html(exam.subject || "Umum")} · ${escape_html(exam.duration_minutes)} menit</p></div> `);
    if (exam.is_active) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="badge-success text-sm px-4 py-1.5">Aktif</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span class="badge bg-slate-100 text-slate-500 text-sm px-4 py-1.5">Nonaktif</span>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (exam.description) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-3 text-sm text-slate-600">${escape_html(exam.description)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="mt-4 flex flex-wrap gap-4 text-xs text-slate-500"><span>Mulai: ${escape_html(exam.start_time ? new Date(exam.start_time).toLocaleString("id-ID") : "-")}</span> <span>Selesai: ${escape_html(exam.end_time ? new Date(exam.end_time).toLocaleString("id-ID") : "-")}</span></div></div> <div class="grid grid-cols-3 gap-4"><div class="card p-4 text-center"><p class="text-2xl font-bold text-gradient">${escape_html(questions.length)}</p> <p class="text-xs text-slate-500">Soal</p></div> <div class="card p-4 text-center"><p class="text-2xl font-bold text-gradient-cyan">${escape_html(attempts.length)}</p> <p class="text-xs text-slate-500">Peserta</p></div> <div class="card p-4 text-center"><p class="text-2xl font-bold text-amber-500">${escape_html(tokens.length)}</p> <p class="text-xs text-slate-500">Token</p></div></div> <div class="card overflow-hidden"><div class="p-5 border-b border-slate-100 flex items-center justify-between"><h2 class="text-lg font-bold text-slate-800">Daftar Soal</h2> <a${attr("href", `/guru/bank-soal/${stringify(exam.id)}`)} class="btn-sm btn-outline">Kelola Soal</a></div> `);
    if (questions.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-8 text-center text-slate-400 text-sm">Belum ada soal untuk ujian ini.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="divide-y divide-slate-100"><!--[-->`);
      const each_array = ensure_array_like(questions);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let q = each_array[$$index];
        $$renderer2.push(`<div class="p-4 flex items-center gap-3"><span class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">${escape_html(q.question_number)}</span> <div class="flex-1 min-w-0"><p class="text-sm text-slate-700 truncate">${escape_html(q.question_text)}</p> <span class="text-[10px] badge-primary mt-0.5">${escape_html(QUESTION_TYPE_LABELS[q.type] || q.type)}</span></div> <span class="text-xs text-slate-400">${escape_html(q.points)} poin</span></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="card overflow-hidden"><div class="p-5 border-b border-slate-100"><h2 class="text-lg font-bold text-slate-800">Riwayat Peserta</h2></div> `);
    if (attempts.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-8 text-center text-slate-400 text-sm">Belum ada peserta yang mengerjakan ujian ini.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="table-container border-0 rounded-none"><table class="table"><thead><tr><th>Siswa</th><th>Status</th><th>Nilai</th><th>Waktu Mulai</th></tr></thead><tbody><!--[-->`);
      const each_array_1 = ensure_array_like(attempts);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let a = each_array_1[$$index_1];
        $$renderer2.push(`<tr><td class="font-medium">${escape_html(a.student_name)}</td><td><span${attr_class(clsx(ATTEMPT_STATUS_COLORS[a.status] || "badge-info"))}>${escape_html(ATTEMPT_STATUS_LABELS[a.status] || a.status)}</span></td><td class="font-semibold">${escape_html(a.score != null ? a.score : "-")}</td><td class="text-xs text-slate-500">${escape_html(new Date(a.start_time).toLocaleString("id-ID"))}</td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
