import { h as head, f as ensure_array_like, e as escape_html, d as bind_props } from "../../../chunks/index.js";
import { S as StatCard } from "../../../chunks/StatCard.js";
import { I as ICONS } from "../../../chunks/constants.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    const { totalSchools, totalAdmins, recentSchools } = data;
    head("1rv6dyv", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Superadmin Dashboard - Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6"><div><h1 class="text-3xl font-bold text-slate-800 tracking-tight">Superadmin Dashboard</h1> <p class="text-slate-500 mt-1">Ringkasan penggunaan platform ujian multi-sekolah.</p></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">`);
    StatCard($$renderer2, {
      label: "Total Sekolah",
      value: totalSchools.toString(),
      icon: ICONS.school,
      gradient: "indigo"
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      label: "Total Admin Sekolah",
      value: totalAdmins.toString(),
      icon: ICONS.users,
      gradient: "cyan"
    });
    $$renderer2.push(`<!----></div> <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"><div class="p-6 border-b border-slate-100"><h2 class="text-xl font-bold text-slate-800">Sekolah Terbaru</h2></div> <div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-slate-50 text-slate-500 text-sm"><th class="p-4 font-semibold">Nama Sekolah</th><th class="p-4 font-semibold">Alamat</th><th class="p-4 font-semibold">Tanggal Daftar</th><th class="p-4 font-semibold">Status</th></tr></thead><tbody class="divide-y divide-slate-100 text-slate-700">`);
    const each_array = ensure_array_like(recentSchools);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let school = each_array[$$index];
        $$renderer2.push(`<tr class="hover:bg-slate-50 transition-colors"><td class="p-4 font-medium text-slate-900">${escape_html(school.name)}</td><td class="p-4">${escape_html(school.address || "-")}</td><td class="p-4">${escape_html((/* @__PURE__ */ new Date(String(school.created_at).replace(" ", "T") + (String(school.created_at).includes("Z") ? "" : "Z"))).toLocaleDateString("id-ID"))}</td><td class="p-4">`);
        if (school.is_active) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge badge-success">Aktif</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="badge badge-danger">Nonaktif</span>`);
        }
        $$renderer2.push(`<!--]--></td></tr>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<tr><td colspan="4" class="p-8 text-center text-slate-500">Belum ada data sekolah.</td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
