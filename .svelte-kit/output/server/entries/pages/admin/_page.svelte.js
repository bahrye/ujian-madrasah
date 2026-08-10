import { h as head, e as escape_html, c as stringify, i as ensure_array_like, j as attr_class, a as attr_style, k as attr, l as clsx, f as bind_props } from "../../../chunks/index.js";
import { p as parseDate } from "../../../chunks/date.js";
import { S as StatCard } from "../../../chunks/StatCard.js";
import { A as ATTEMPT_STATUS_COLORS, a as ATTEMPT_STATUS_LABELS, I as ICONS } from "../../../chunks/constants.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let stats, recentAttempts;
    let data = $$props["data"];
    stats = data.stats;
    recentAttempts = data.recentAttempts;
    head("1jef3w8", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Dashboard Admin — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div><h1 class="text-2xl font-bold text-slate-800">Dashboard Admin</h1> <p class="text-sm text-slate-500 mt-1">Selamat datang, ${escape_html(data.user.name)}. Berikut ringkasan sistem.</p></div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">`);
    StatCard($$renderer2, {
      label: "Total Pengguna",
      value: stats.totalUsers,
      icon: ICONS.users,
      gradient: "indigo"
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      label: "Ujian Aktif",
      value: `${stringify(stats.activeExams)} / ${stringify(stats.totalExams)}`,
      icon: ICONS.exam,
      gradient: "cyan"
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      label: "Sedang Mengerjakan",
      value: stats.sedangMengerjakan,
      icon: ICONS.clock,
      gradient: "amber"
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      label: "Ujian Selesai",
      value: stats.selesai,
      icon: ICONS.check,
      gradient: "emerald"
    });
    $$renderer2.push(`<!----></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-4"><div class="card p-5"><h2 class="text-lg font-bold text-slate-800 mb-4">Distribusi Pengguna</h2> <div class="space-y-3"><!--[-->`);
    const each_array = ensure_array_like([
      {
        role: "admin",
        label: "Administrator",
        color: "bg-rose-500",
        bg: "bg-rose-100"
      },
      {
        role: "guru",
        label: "Guru",
        color: "bg-indigo-500",
        bg: "bg-indigo-100"
      },
      {
        role: "pengawas",
        label: "Pengawas",
        color: "bg-amber-500",
        bg: "bg-amber-100"
      },
      {
        role: "siswa",
        label: "Siswa",
        color: "bg-cyan-500",
        bg: "bg-cyan-100"
      }
    ]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$renderer2.push(`<div class="flex items-center gap-3"><span class="text-sm font-medium text-slate-600 w-28">${escape_html(item.label)}</span> <div${attr_class(`flex-1 h-3 ${stringify(item.bg)} rounded-full overflow-hidden`)}><div${attr_class(`h-full ${stringify(item.color)} rounded-full transition-all duration-700`)}${attr_style(`width: ${stringify(stats.totalUsers > 0 ? (stats.roleCounts[item.role] || 0) / stats.totalUsers * 100 : 0)}%`)}></div></div> <span class="text-sm font-bold text-slate-700 w-8 text-right">${escape_html(stats.roleCounts[item.role] || 0)}</span></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="card p-5"><h2 class="text-lg font-bold text-slate-800 mb-4">Aksi Cepat</h2> <div class="grid grid-cols-2 gap-3"><a href="/admin/users" class="card-hover p-4 text-center group"><div class="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.users)}></path></svg></div> <span class="text-xs font-semibold text-slate-700">Kelola Pengguna</span></a> <a href="/admin/exams" class="card-hover p-4 text-center group"><div class="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg></div> <span class="text-xs font-semibold text-slate-700">Kelola Ujian</span></a> <a href="/admin/results" class="card-hover p-4 text-center group"><div class="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.results)}></path></svg></div> <span class="text-xs font-semibold text-slate-700">Hasil Ujian</span></a> <a href="/admin/bank-soal" class="card-hover p-4 text-center group"><div class="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.questions)}></path></svg></div> <span class="text-xs font-semibold text-slate-700">Bank Soal</span></a></div></div></div> <div class="card overflow-hidden"><div class="p-5 border-b border-slate-100"><h2 class="text-lg font-bold text-slate-800">Aktivitas Ujian Terbaru</h2></div> `);
    if (recentAttempts.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-8 text-center text-slate-400"><svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg> <p class="text-sm">Belum ada aktivitas ujian.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="table-container border-0 rounded-none"><table class="table"><thead><tr><th>Siswa</th><th>Ujian</th><th>Status</th><th>Nilai</th><th>Waktu</th></tr></thead><tbody><!--[-->`);
      const each_array_1 = ensure_array_like(recentAttempts);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let attempt = each_array_1[$$index_1];
        $$renderer2.push(`<tr><td class="font-medium text-slate-700">${escape_html(attempt.student_name)}</td><td class="text-slate-600">${escape_html(attempt.exam_title)}</td><td><span${attr_class(clsx(ATTEMPT_STATUS_COLORS[attempt.status] || "badge-info"))}>${escape_html(ATTEMPT_STATUS_LABELS[attempt.status] || attempt.status)}</span></td><td class="font-semibold">${escape_html(attempt.score != null ? attempt.score : "-")}</td><td class="text-xs text-slate-500">${escape_html(attempt.created_at ? parseDate(attempt.created_at).toLocaleDateString("id-ID") : "-")}</td></tr>`);
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
