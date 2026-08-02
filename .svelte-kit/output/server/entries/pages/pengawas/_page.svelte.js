import { h as head, e as escape_html, i as attr, b as bind_props } from "../../../chunks/index.js";
import { S as StatCard } from "../../../chunks/StatCard.js";
import { I as ICONS } from "../../../chunks/constants.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    head("9iohvt", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Dashboard Pengawas — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div><h1 class="text-2xl font-bold text-slate-800">Dashboard Pengawas</h1> <p class="text-sm text-slate-500 mt-1">Selamat datang, ${escape_html(data.user.name)}.</p></div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">`);
    StatCard($$renderer2, {
      label: "Ujian Aktif",
      value: data.stats.activeExams,
      icon: ICONS.exam,
      gradient: "indigo"
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      label: "Total Token",
      value: data.stats.totalTokens,
      icon: ICONS.token,
      gradient: "amber"
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      label: "Sedang Mengerjakan",
      value: data.stats.activeAttempts,
      icon: ICONS.monitor,
      gradient: "cyan"
    });
    $$renderer2.push(`<!----></div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><a href="/pengawas/tokens" class="card-hover p-6 text-center group"><div class="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20"><svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.token)}></path></svg></div> <h3 class="font-bold text-slate-800">Kelola Token Ujian</h3> <p class="text-sm text-slate-500 mt-1">Generate dan rilis token untuk siswa</p></a> <a href="/pengawas/monitor" class="card-hover p-6 text-center group"><div class="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20"><svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.monitor)}></path></svg></div> <h3 class="font-bold text-slate-800">Monitoring Ujian</h3> <p class="text-sm text-slate-500 mt-1">Pantau siswa yang sedang mengerjakan</p></a></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
