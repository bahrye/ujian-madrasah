import { h as head, e as escape_html, i as attr, a as stringify, c as ensure_array_like, d as attr_class, j as clsx, b as bind_props } from "../../../chunks/index.js";
import { A as ATTEMPT_STATUS_COLORS, a as ATTEMPT_STATUS_LABELS, I as ICONS } from "../../../chunks/constants.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activeExams, myAttempts, activeAttempt;
    let data = $$props["data"];
    activeExams = data.activeExams;
    myAttempts = data.myAttempts;
    activeAttempt = data.activeAttempt;
    head("1sjgise", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Dashboard Siswa — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div><h1 class="text-2xl font-bold text-slate-800">Dashboard Siswa</h1> <p class="text-sm text-slate-500 mt-1">Selamat datang, ${escape_html(data.user.name)}.</p></div> `);
    if (activeAttempt) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="card p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center animate-pulse"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path></svg></div> <div class="flex-1"><h3 class="font-bold text-amber-800">Ujian Sedang Berlangsung</h3> <p class="text-sm text-amber-600">${escape_html(activeAttempt.exam_title)}</p></div> <a${attr("href", `/siswa/ujian/${stringify(activeAttempt.id)}`)} class="btn-warning">Lanjutkan <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronRight)}></path></svg></a></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div><h2 class="text-lg font-bold text-slate-800 mb-3">Ujian Tersedia</h2> `);
    if (activeExams.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="card p-8 text-center text-slate-400"><svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg> <p>Tidak ada ujian yang tersedia saat ini.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
      const each_array = ensure_array_like(activeExams);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let exam = each_array[$$index];
        $$renderer2.push(`<div class="card-hover p-5"><div class="flex items-start justify-between mb-3"><div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg></div> <span class="badge-success">Tersedia</span></div> <h3 class="font-bold text-slate-800">${escape_html(exam.title)}</h3> <p class="text-sm text-slate-500 mt-1">${escape_html(exam.subject || "Umum")}</p> <div class="flex flex-wrap gap-3 mt-3 text-xs text-slate-500"><span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path></svg> ${escape_html(exam.duration_minutes)} menit</span></div> <a href="/siswa/ujian" class="btn-primary w-full mt-4 justify-center">Mulai Ujian</a></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div><h2 class="text-lg font-bold text-slate-800 mb-3">Riwayat Ujian</h2> `);
    if (myAttempts.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="card p-6 text-center text-slate-400 text-sm">Belum ada riwayat ujian.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="card overflow-hidden"><div class="table-container border-0 rounded-none"><table class="table"><thead><tr><th>Ujian</th><th>Mapel</th><th>Status</th><th>Nilai</th><th>Tanggal</th></tr></thead><tbody><!--[-->`);
      const each_array_1 = ensure_array_like(myAttempts);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let a = each_array_1[$$index_1];
        $$renderer2.push(`<tr><td class="font-medium">${escape_html(a.exam_title)}</td><td class="text-slate-500">${escape_html(a.subject || "-")}</td><td><span${attr_class(clsx(ATTEMPT_STATUS_COLORS[a.status]))}>${escape_html(ATTEMPT_STATUS_LABELS[a.status])}</span></td><td${attr_class(`font-bold ${(a.score ?? 0) >= 70 ? "text-emerald-600" : "text-rose-600"}`)}>${escape_html(a.score != null ? a.score.toFixed(1) : "-")}</td><td class="text-xs text-slate-500">${escape_html(new Date(a.created_at).toLocaleDateString("id-ID"))}</td></tr>`);
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
