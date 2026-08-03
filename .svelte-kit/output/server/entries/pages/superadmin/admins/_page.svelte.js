import { h as head, c as ensure_array_like, e as escape_html, i as attr, b as bind_props } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { C as ConfirmForm } from "../../../../chunks/ConfirmForm.js";
import { t as toasts } from "../../../../chunks/toast.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let form = $$props["form"];
    let isAdding = false;
    if (form?.error) {
      toasts.error(form.error);
    } else if (form?.success) {
      toasts.success("Berhasil mengelola admin");
      isAdding = false;
    }
    head("1bp2wq8", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Kelola Admin - Superadmin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6"><div class="flex justify-between items-end"><div><h1 class="text-3xl font-bold text-slate-800 tracking-tight">Admin Sekolah</h1> <p class="text-slate-500 mt-1">Kelola akun administrator untuk setiap sekolah.</p></div> <button class="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Tambah Admin</button></div> `);
    if (isAdding) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in"><h2 class="text-xl font-bold text-slate-800 mb-4">Buat Akun Admin Baru</h2> <form method="POST" action="?/add" class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl"><div class="col-span-1 md:col-span-2"><label for="school_id" class="block text-sm font-medium text-slate-700 mb-1">Pilih Sekolah <span class="text-red-500">*</span></label> <div class="relative"><select id="school_id" name="school_id" class="select w-full" required="">`);
      $$renderer2.option({ value: "" }, ($$renderer3) => {
        $$renderer3.push(`-- Pilih Sekolah --`);
      });
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(data.schools);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let school = each_array[$$index];
        $$renderer2.option(
          {
            value: school.id,
            selected: form?.school_id === school.id.toString()
          },
          ($$renderer3) => {
            $$renderer3.push(`${escape_html(school.name)}`);
          }
        );
      }
      $$renderer2.push(`<!--]--></select></div></div> <div><label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label> <input type="text" id="name" name="name" class="input" required="" placeholder="Nama lengkap admin"${attr("value", form?.name || "")}/></div> <div><label for="username" class="block text-sm font-medium text-slate-700 mb-1">Username <span class="text-red-500">*</span></label> <input type="text" id="username" name="username" class="input" required="" placeholder="username_admin"${attr("value", form?.username || "")}/></div> <div><label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password <span class="text-red-500">*</span></label> <input type="password" id="password" name="password" class="input" required="" placeholder="Minimal 6 karakter"/></div> <div class="col-span-1 md:col-span-2 flex space-x-3 pt-2"><button type="submit" class="btn btn-primary">Simpan Admin</button> <button type="button" class="btn btn-secondary">Batal</button></div></form></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-slate-50 text-slate-500 text-sm"><th class="p-4 font-semibold">Nama / Username</th><th class="p-4 font-semibold">Sekolah (Tenant)</th><th class="p-4 font-semibold">Dibuat</th><th class="p-4 font-semibold">Status</th><th class="p-4 font-semibold text-right">Aksi</th></tr></thead><tbody class="divide-y divide-slate-100 text-slate-700">`);
    const each_array_1 = ensure_array_like(data.admins);
    if (each_array_1.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let admin = each_array_1[$$index_1];
        $$renderer2.push(`<tr class="hover:bg-slate-50 transition-colors"><td class="p-4"><div class="font-medium text-slate-900">${escape_html(admin.name)}</div> <div class="text-sm text-slate-500">@${escape_html(admin.username)}</div></td><td class="p-4 font-medium text-indigo-600">${escape_html(admin.school_name || "Tidak diketahui")}</td><td class="p-4 text-sm">${escape_html((/* @__PURE__ */ new Date(String(admin.created_at).replace(" ", "T") + (String(admin.created_at).includes("Z") ? "" : "Z"))).toLocaleDateString("id-ID"))}</td><td class="p-4">`);
        if (admin.is_active) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge badge-success">Aktif</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="badge badge-danger">Nonaktif</span>`);
        }
        $$renderer2.push(`<!--]--></td><td class="p-4 text-right space-x-2"><form method="POST" action="?/toggleStatus" class="inline-block"><input type="hidden" name="id"${attr("value", admin.id)}/> <input type="hidden" name="is_active"${attr("value", admin.is_active)}/> <button type="submit" class="btn btn-secondary py-1 px-3 text-xs"${attr("title", admin.is_active ? "Nonaktifkan" : "Aktifkan")}>${escape_html(admin.is_active ? "Nonaktifkan" : "Aktifkan")}</button></form> `);
        ConfirmForm($$renderer2, {
          action: "?/delete",
          confirmTitle: "Hapus Admin",
          confirmMessage: `Yakin ingin menghapus admin ${admin.name}?`,
          buttonClass: "btn bg-red-50 text-red-600 hover:bg-red-100 py-1 px-3 text-xs",
          buttonTitle: "Hapus",
          $$slots: {
            inputs: ($$renderer3) => {
              {
                $$renderer3.push(`<input type="hidden" name="id"${attr("value", admin.id)}/>`);
              }
            },
            buttonContent: ($$renderer3) => {
              {
                $$renderer3.push(`Hapus`);
              }
            }
          }
        });
        $$renderer2.push(`<!----></td></tr>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<tr><td colspan="5" class="p-8 text-center text-slate-500">Belum ada admin sekolah. Silakan buat yang pertama.</td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div></div>`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
