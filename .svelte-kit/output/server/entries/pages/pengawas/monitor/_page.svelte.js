import { h as head, c as ensure_array_like, e as escape_html, i as attr, d as attr_class, j as clsx, b as bind_props } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { A as ATTEMPT_STATUS_COLORS, a as ATTEMPT_STATUS_LABELS, I as ICONS } from "../../../../chunks/constants.js";
import { t as toasts } from "../../../../chunks/toast.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let attempts;
    let data = $$props["data"];
    let form = $$props["form"];
    if (form?.success) toasts.success(form.success);
    if (form?.error) toasts.error(form.error);
    attempts = data.attempts;
    head("1lbp9vi", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Monitoring Ujian — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div><h1 class="text-2xl font-bold text-slate-800">Monitoring Ujian</h1> <p class="text-sm text-slate-500 mt-1">Pantau siswa yang sedang mengerjakan ujian</p></div> <div class="card p-4"><form method="GET" class="flex gap-3"><select name="exam_id" class="select flex-1">`);
    $$renderer2.option({ value: "" }, ($$renderer3) => {
      $$renderer3.push(`Semua (Sedang Mengerjakan)`);
    });
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(data.exams);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let exam = each_array[$$index];
      $$renderer2.option(
        {
          value: exam.id,
          selected: data.examFilter === String(exam.id)
        },
        ($$renderer3) => {
          $$renderer3.push(`${escape_html(exam.title)}`);
        }
      );
    }
    $$renderer2.push(`<!--]--></select> <button type="submit" class="btn-secondary btn-sm">Filter</button></form></div> <div class="card overflow-hidden">`);
    if (attempts.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-12 text-center text-slate-400"><svg class="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.monitor)}></path></svg> <p class="text-lg font-medium">Tidak ada siswa yang sedang mengerjakan</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="table-container border-0 rounded-none"><table class="table"><thead><tr><th>Siswa</th><th>Username</th>`);
      if (!data.examFilter) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<th>Ujian</th>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--><th>Status</th><th>Mulai</th><th class="text-right">Aksi</th></tr></thead><tbody><!--[-->`);
      const each_array_1 = ensure_array_like(attempts);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let a = each_array_1[$$index_1];
        $$renderer2.push(`<tr><td class="font-semibold text-slate-800">${escape_html(a.student_name)}</td><td class="text-slate-500">@${escape_html(a.username)}</td>`);
        if (!data.examFilter) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<td class="text-slate-600">${escape_html(a.exam_title)}</td>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--><td><span${attr_class(clsx(ATTEMPT_STATUS_COLORS[a.status] || "badge-info"))}>`);
        if (a.status === "mengerjakan") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse mr-1"></span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> ${escape_html(ATTEMPT_STATUS_LABELS[a.status] || a.status)}</span></td><td class="text-xs text-slate-500">${escape_html(new Date(a.start_time).toLocaleString("id-ID"))}</td><td class="text-right">`);
        if (a.status === "mengerjakan") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<button class="btn-sm btn-danger"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.refresh)}></path></svg> Reset</button>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
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
