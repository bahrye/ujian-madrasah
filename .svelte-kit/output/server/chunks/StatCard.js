import { m as fallback, e as escape_html, j as attr_class, k as attr, f as bind_props, c as stringify } from "./index.js";
function StatCard($$renderer, $$props) {
  let value = fallback($$props["value"], "");
  let label = fallback($$props["label"], "");
  let gradient = fallback($$props["gradient"], "indigo");
  let icon = fallback($$props["icon"], "");
  let trend = fallback($$props["trend"], "");
  let trendUp = fallback($$props["trendUp"], true);
  const gradients = {
    indigo: "from-indigo-500 to-violet-500",
    cyan: "from-cyan-500 to-sky-500",
    emerald: "from-emerald-500 to-teal-500",
    amber: "from-amber-400 to-orange-500",
    rose: "from-rose-500 to-pink-500"
  };
  const glows = {
    indigo: "shadow-indigo-500/20",
    cyan: "shadow-cyan-500/20",
    emerald: "shadow-emerald-500/20",
    amber: "shadow-amber-500/20",
    rose: "shadow-rose-500/20"
  };
  $$renderer.push(`<div class="card-hover p-5 group"><div class="flex items-start justify-between"><div class="flex-1"><p class="text-sm font-medium text-slate-500 mb-1">${escape_html(label)}</p> <p class="text-3xl font-bold text-slate-800 tracking-tight">${escape_html(value)}</p> `);
  if (trend) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div class="flex items-center gap-1 mt-2"><svg${attr_class(`w-4 h-4 ${trendUp ? "text-emerald-500" : "text-rose-500"}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", trendUp ? "M7 11l5-5m0 0l5 5m-5-5v12" : "M17 13l-5 5m0 0l-5-5m5 5V6")}></path></svg> <span${attr_class(`text-xs font-semibold ${trendUp ? "text-emerald-600" : "text-rose-600"}`)}>${escape_html(trend)}</span></div>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div> `);
  if (icon) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div${attr_class(`w-12 h-12 rounded-xl bg-gradient-to-br ${stringify(gradients[gradient])} shadow-lg ${stringify(glows[gradient])} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`)}><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", icon)}></path></svg></div>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div></div>`);
  bind_props($$props, { value, label, gradient, icon, trend, trendUp });
}
export {
  StatCard as S
};
