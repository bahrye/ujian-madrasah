import { h as head, c as ensure_array_like, e as escape_html, d as attr_class, j as clsx, b as bind_props } from "../../../../chunks/index.js";
import { A as ATTEMPT_STATUS_COLORS, a as ATTEMPT_STATUS_LABELS } from "../../../../chunks/constants.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let results;
    let data = $$props["data"];
    results = data.results;
    head("nnpp9p", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Hasil Ujian — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div><h1 class="text-2xl font-bold text-slate-800">Hasil Ujian</h1> <p class="text-sm text-slate-500 mt-1">Rekap nilai seluruh ujian</p></div> <div class="card overflow-hidden">`);
    if (results.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-12 text-center text-slate-400">Belum ada hasil ujian.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="table-container border-0 rounded-none"><table class="table"><thead><tr><th>Siswa</th><th>Ujian</th><th>Mapel</th><th>Nilai</th><th>Status</th><th>Waktu Selesai</th></tr></thead><tbody><!--[-->`);
      const each_array = ensure_array_like(results);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let r = each_array[$$index];
        $$renderer2.push(`<tr><td class="font-semibold text-slate-800">${escape_html(r.student_name)}</td><td>${escape_html(r.exam_title)}</td><td class="text-slate-500">${escape_html(r.subject || "-")}</td><td><span${attr_class(`text-lg font-bold ${(r.score ?? 0) >= 70 ? "text-emerald-600" : "text-rose-600"}`)}>${escape_html(r.score != null ? r.score.toFixed(1) : "-")}</span></td><td><span${attr_class(clsx(ATTEMPT_STATUS_COLORS[r.status] || "badge-info"))}>${escape_html(ATTEMPT_STATUS_LABELS[r.status])}</span></td><td class="text-xs text-slate-500">${escape_html(r.submit_time ? new Date(r.submit_time).toLocaleString("id-ID") : "-")}</td></tr>`);
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
