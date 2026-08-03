import { h as head, j as attr, f as ensure_array_like, e as escape_html, i as attr_class, k as clsx, d as bind_props } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { b as ROLE_COLORS, R as ROLE_LABELS, I as ICONS } from "../../../../chunks/constants.js";
import { t as toasts } from "../../../../chunks/toast.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let form = $$props["form"];
    if (form?.success) toasts.success(form.success);
    if (form?.error) toasts.error(form.error);
    head("1p497kv", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Manajemen Pengguna — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-2xl font-bold text-slate-800">Manajemen Pengguna</h1> <p class="text-sm text-slate-500 mt-1">Kelola data pengguna sistem</p></div> <button class="btn-primary"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.plus)}></path></svg> Tambah Pengguna</button></div> <div class="card p-4"><form method="GET" class="flex flex-col sm:flex-row gap-3"><div class="relative flex-1"><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.search)}></path></svg> <input name="search" type="text" class="input pl-9" placeholder="Cari pengguna..."${attr("value", data.search)}/></div> <select name="role" class="select w-full sm:w-40">`);
    $$renderer2.option({ value: "" }, ($$renderer3) => {
      $$renderer3.push(`Semua Role`);
    });
    $$renderer2.option({ value: "admin", selected: data.roleFilter === "admin" }, ($$renderer3) => {
      $$renderer3.push(`Admin`);
    });
    $$renderer2.option({ value: "guru", selected: data.roleFilter === "guru" }, ($$renderer3) => {
      $$renderer3.push(`Guru`);
    });
    $$renderer2.option({ value: "pengawas", selected: data.roleFilter === "pengawas" }, ($$renderer3) => {
      $$renderer3.push(`Pengawas`);
    });
    $$renderer2.option({ value: "siswa", selected: data.roleFilter === "siswa" }, ($$renderer3) => {
      $$renderer3.push(`Siswa`);
    });
    $$renderer2.push(`</select> <button type="submit" class="btn-secondary btn-sm">Cari</button></form></div> <div class="card overflow-hidden"><div class="table-container border-0 rounded-none"><table class="table"><thead><tr><th>Nama</th><th>Username</th><th>Role</th><th>Status</th><th>Dibuat</th><th class="text-right">Aksi</th></tr></thead><tbody>`);
    const each_array = ensure_array_like(data.users);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let user = each_array[$$index];
        $$renderer2.push(`<tr><td class="font-semibold text-slate-800">${escape_html(user.name)}</td><td class="text-slate-600">@${escape_html(user.username)}</td><td><span${attr_class(clsx(ROLE_COLORS[user.role] || "badge-info"))}>${escape_html(ROLE_LABELS[user.role] || user.role)}</span></td><td>`);
        if (user.is_active) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge-success">Aktif</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="badge-danger">Nonaktif</span>`);
        }
        $$renderer2.push(`<!--]--></td><td class="text-xs text-slate-500">${escape_html((/* @__PURE__ */ new Date(String(user.created_at).replace(" ", "T") + (String(user.created_at).includes("Z") ? "" : "Z"))).toLocaleDateString("id-ID"))}</td><td class="text-right"><div class="flex items-center justify-end gap-1"><button class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Edit"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.edit)}></path></svg></button> <button class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Hapus"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.trash)}></path></svg></button></div></td></tr>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<tr><td colspan="6" class="text-center py-8 text-slate-400">Tidak ada pengguna ditemukan.</td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div></div> `);
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
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
