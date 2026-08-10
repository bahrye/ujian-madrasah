import { h as head, k as attr, e as escape_html, i as ensure_array_like, j as attr_class, f as bind_props } from "../../../../chunks/index.js";
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
    let editingSchool = null;
    if (form?.error) {
      toasts.error(form.error);
    } else if (form?.success) {
      toasts.success("Berhasil menyimpan data sekolah");
      isAdding = false;
      editingSchool = null;
    }
    head("u3pgvh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Kelola Sekolah - Superadmin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6"><div class="flex justify-between items-end"><div><h1 class="text-3xl font-bold text-slate-800 tracking-tight">Kelola Sekolah (Tenant)</h1> <p class="text-slate-500 mt-1">Daftar semua madrasah yang menggunakan platform ini.</p></div> <button class="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Tambah Sekolah</button></div> `);
    if (isAdding) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in"><h2 class="text-xl font-bold text-slate-800 mb-4">Tambah Sekolah Baru</h2> <form method="POST" action="?/add" class="space-y-4 max-w-lg"><div><label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nama Sekolah <span class="text-red-500">*</span></label> <input type="text" id="name" name="name" class="input" required="" placeholder="Contoh: MAN 1 Jakarta"${attr("value", form?.name || "")}/></div> <div><label for="address" class="block text-sm font-medium text-slate-700 mb-1">Alamat</label> <textarea id="address" name="address" class="input min-h-[100px]" placeholder="Alamat lengkap...">`);
      const $$body = escape_html(form?.address || "");
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea></div> <div class="flex space-x-3 pt-2"><button type="submit" class="btn btn-primary">Simpan</button> <button type="button" class="btn btn-secondary">Batal</button></div></form></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (editingSchool) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in mb-6"><h2 class="text-xl font-bold text-slate-800 mb-4">Edit Sekolah</h2> <form method="POST" action="?/edit" class="space-y-4 max-w-lg"><input type="hidden" name="id"${attr("value", editingSchool.id)}/> <div><label for="e-name" class="block text-sm font-medium text-slate-700 mb-1">Nama Sekolah <span class="text-red-500">*</span></label> <input type="text" id="e-name" name="name" class="input" required=""${attr("value", editingSchool.name)}/></div> <div><label for="e-address" class="block text-sm font-medium text-slate-700 mb-1">Alamat</label> <textarea id="e-address" name="address" class="input min-h-[100px]" placeholder="Alamat lengkap...">`);
      const $$body_1 = escape_html(editingSchool.address || "");
      if ($$body_1) {
        $$renderer2.push(`${$$body_1}`);
      }
      $$renderer2.push(`</textarea></div> <div class="flex space-x-3 pt-2"><button type="submit" class="btn btn-primary">Simpan Perubahan</button> <button type="button" class="btn btn-secondary">Batal</button></div></form></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-slate-50 text-slate-500 text-sm"><th class="p-4 font-semibold">ID</th><th class="p-4 font-semibold">Nama Sekolah</th><th class="p-4 font-semibold">Alamat</th><th class="p-4 font-semibold">Status</th><th class="p-4 font-semibold text-right">Aksi</th></tr></thead><tbody class="divide-y divide-slate-100 text-slate-700">`);
    const each_array = ensure_array_like(data.schools);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let school = each_array[$$index];
        $$renderer2.push(`<tr class="hover:bg-slate-50 transition-colors"><td class="p-4 text-sm text-slate-400">#${escape_html(school.id)}</td><td class="p-4 font-medium text-slate-900">${escape_html(school.name)}</td><td class="p-4 text-sm truncate max-w-xs"${attr("title", school.address)}>${escape_html(school.address || "-")}</td><td class="p-4">`);
        if (school.is_active) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge badge-success">Aktif</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="badge badge-danger">Nonaktif</span>`);
        }
        $$renderer2.push(`<!--]--></td><td class="p-4 text-right"><div class="flex items-center justify-end space-x-2"><button class="btn-ghost btn-sm">Edit</button> <form method="POST" action="?/toggleStatus" class="inline-block"><input type="hidden" name="id"${attr("value", school.id)}/> <input type="hidden" name="is_active"${attr("value", school.is_active)}/> <button type="submit"${attr_class(`btn-ghost btn-sm ${school.is_active ? "text-amber-600" : "text-green-600"}`)}>${escape_html(school.is_active ? "Nonaktifkan" : "Aktifkan")}</button></form> `);
        ConfirmForm($$renderer2, {
          action: "?/delete",
          confirmTitle: "Hapus Sekolah",
          confirmMessage: "Apakah Anda yakin ingin menghapus sekolah ini? Semua data terkait (user, ujian, dll) akan ikut terhapus!",
          buttonClass: "btn-ghost btn-sm text-red-600",
          buttonTitle: "Hapus",
          $$slots: {
            inputs: ($$renderer3) => {
              {
                $$renderer3.push(`<input type="hidden" name="id"${attr("value", school.id)}/>`);
              }
            },
            buttonContent: ($$renderer3) => {
              {
                $$renderer3.push(`Hapus`);
              }
            }
          }
        });
        $$renderer2.push(`<!----></div></td></tr>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<tr><td colspan="5" class="p-8 text-center text-slate-500">Belum ada data sekolah. Silakan tambahkan.</td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div></div>`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
