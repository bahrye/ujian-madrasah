import { h as head, i as attr, c as ensure_array_like, e as escape_html, b as bind_props } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { t as toasts } from "../../../../chunks/toast.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let form = $$props["form"];
    let isAdding = false;
    let editingSubject = null;
    if (form?.error) {
      toasts.error(form.error);
    } else if (form?.success) {
      toasts.success("Berhasil menyimpan data mata pelajaran");
      isAdding = false;
      editingSubject = null;
    }
    head("bz8see", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Mata Pelajaran - Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"><div><h1 class="text-3xl font-bold text-slate-800 tracking-tight">Mata Pelajaran</h1> <p class="text-slate-500 mt-1">Kelola data mata pelajaran di sekolah Anda.</p></div> <button class="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Tambah Mapel</button></div> `);
    if (isAdding) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in"><h2 class="text-xl font-bold text-slate-800 mb-4">Tambah Mata Pelajaran Baru</h2> <form method="POST" action="?/add" class="space-y-4 max-w-lg"><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nama Mata Pelajaran <span class="text-red-500">*</span></label> <input type="text" id="name" name="name" class="input" required="" placeholder="Contoh: Matematika"/></div> <div><label for="code" class="block text-sm font-medium text-slate-700 mb-1">Kode / Singkatan</label> <input type="text" id="code" name="code" class="input" placeholder="Contoh: MTK"/></div></div> <div class="flex space-x-3 pt-2"><button type="submit" class="btn btn-primary">Simpan Mapel</button> <button type="button" class="btn btn-secondary">Batal</button></div></form></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (editingSubject) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in mb-6"><h2 class="text-xl font-bold text-slate-800 mb-4">Edit Mata Pelajaran</h2> <form method="POST" action="?/edit" class="space-y-4 max-w-lg"><input type="hidden" name="id"${attr("value", editingSubject.id)}/> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label for="e-name" class="block text-sm font-medium text-slate-700 mb-1">Nama Mata Pelajaran <span class="text-red-500">*</span></label> <input type="text" id="e-name" name="name" class="input" required=""${attr("value", editingSubject.name)}/></div> <div><label for="e-code" class="block text-sm font-medium text-slate-700 mb-1">Kode / Singkatan</label> <input type="text" id="e-code" name="code" class="input"${attr("value", editingSubject.code || "")}/></div></div> <div class="flex space-x-3 pt-2"><button type="submit" class="btn btn-primary">Simpan Perubahan</button> <button type="button" class="btn btn-secondary">Batal</button></div></form></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-slate-50 text-slate-500 text-sm"><th class="p-4 font-semibold">ID</th><th class="p-4 font-semibold">Kode</th><th class="p-4 font-semibold">Nama Mata Pelajaran</th><th class="p-4 font-semibold text-right">Aksi</th></tr></thead><tbody class="divide-y divide-slate-100 text-slate-700">`);
    const each_array = ensure_array_like(data.subjects);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let subject = each_array[$$index];
        $$renderer2.push(`<tr class="hover:bg-slate-50 transition-colors"><td class="p-4 text-sm text-slate-400">#${escape_html(subject.id)}</td><td class="p-4 font-medium text-slate-900">${escape_html(subject.code || "-")}</td><td class="p-4 font-medium text-slate-900">${escape_html(subject.name)}</td><td class="p-4 text-right"><div class="flex items-center justify-end space-x-2"><button class="btn-ghost btn-sm">Edit</button> <form method="POST" action="?/delete" class="inline-block"><input type="hidden" name="id"${attr("value", subject.id)}/> <button type="submit" class="btn-ghost btn-sm text-red-600">Hapus</button></form></div></td></tr>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<tr><td colspan="4" class="p-12 text-center text-slate-500">Belum ada data mata pelajaran. Silakan tambahkan.</td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div></div>`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
