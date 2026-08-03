import { h as head, j as attr, f as ensure_array_like, e as escape_html, d as bind_props } from "../../../../chunks/index.js";
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
    let editingClass = null;
    if (form?.error) {
      toasts.error(form.error);
    } else if (form?.success) {
      toasts.success("Berhasil menyimpan data kelas");
      isAdding = false;
      editingClass = null;
    }
    head("z0vwwr", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Kelas - Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"><div><h1 class="text-3xl font-bold text-slate-800 tracking-tight">Manajemen Kelas</h1> <p class="text-slate-500 mt-1">Kelola data kelas di sekolah Anda.</p></div> <button class="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Tambah Kelas</button></div> `);
    if (isAdding) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in"><h2 class="text-xl font-bold text-slate-800 mb-4">Tambah Kelas Baru</h2> <form method="POST" action="?/add" class="space-y-4 max-w-lg"><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nama Kelas <span class="text-red-500">*</span></label> <input type="text" id="name" name="name" class="input" required="" placeholder="Contoh: X IPA 1"/></div> <div><label for="level" class="block text-sm font-medium text-slate-700 mb-1">Tingkat</label> <input type="text" id="level" name="level" class="input" placeholder="Contoh: 10, X, atau VII"/></div></div> <div class="flex space-x-3 pt-2"><button type="submit" class="btn btn-primary">Simpan Kelas</button> <button type="button" class="btn btn-secondary">Batal</button></div></form></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (editingClass) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in mb-6"><h2 class="text-xl font-bold text-slate-800 mb-4">Edit Kelas</h2> <form method="POST" action="?/edit" class="space-y-4 max-w-lg"><input type="hidden" name="id"${attr("value", editingClass.id)}/> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label for="e-name" class="block text-sm font-medium text-slate-700 mb-1">Nama Kelas <span class="text-red-500">*</span></label> <input type="text" id="e-name" name="name" class="input" required=""${attr("value", editingClass.name)}/></div> <div><label for="e-level" class="block text-sm font-medium text-slate-700 mb-1">Tingkat</label> <input type="text" id="e-level" name="level" class="input"${attr("value", editingClass.level || "")}/></div></div> <div class="flex space-x-3 pt-2"><button type="submit" class="btn btn-primary">Simpan Perubahan</button> <button type="button" class="btn btn-secondary">Batal</button></div></form></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-slate-50 text-slate-500 text-sm"><th class="p-4 font-semibold">ID</th><th class="p-4 font-semibold">Tingkat</th><th class="p-4 font-semibold">Nama Kelas</th><th class="p-4 font-semibold">Jumlah Siswa</th><th class="p-4 font-semibold text-right">Aksi</th></tr></thead><tbody class="divide-y divide-slate-100 text-slate-700">`);
    const each_array = ensure_array_like(data.classes);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let cls = each_array[$$index];
        $$renderer2.push(`<tr class="hover:bg-slate-50 transition-colors"><td class="p-4 text-sm text-slate-400">#${escape_html(cls.id)}</td><td class="p-4 font-medium text-slate-900">${escape_html(cls.level || "-")}</td><td class="p-4 font-medium text-slate-900">${escape_html(cls.name)}</td><td class="p-4"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">${escape_html(cls.student_count)} Siswa</span></td><td class="p-4 text-right"><div class="flex items-center justify-end space-x-2"><button class="btn-ghost btn-sm">Edit</button> `);
        ConfirmForm($$renderer2, {
          action: "?/delete",
          confirmTitle: "Hapus Kelas",
          confirmMessage: "Hapus kelas ini? Siswa di kelas ini tidak akan dihapus, tetapi kelasnya akan menjadi kosong.",
          buttonClass: "btn-ghost btn-sm text-red-600",
          buttonTitle: "Hapus",
          $$slots: {
            inputs: ($$renderer3) => {
              {
                $$renderer3.push(`<input type="hidden" name="id"${attr("value", cls.id)}/>`);
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
      $$renderer2.push(`<tr><td colspan="5" class="p-12 text-center text-slate-500">Belum ada data kelas. Silakan tambahkan.</td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div></div>`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
