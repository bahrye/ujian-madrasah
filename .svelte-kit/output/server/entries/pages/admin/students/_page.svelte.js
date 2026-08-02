import { h as head, c as ensure_array_like, e as escape_html, i as attr, d as attr_class, b as bind_props } from "../../../../chunks/index.js";
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
    let editingUser = null;
    let filterClass = "";
    if (form?.error) {
      toasts.error(form.error);
    } else if (form?.success) {
      toasts.success("Berhasil menyimpan data siswa");
      isAdding = false;
      editingUser = null;
    }
    head("19at0ld", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Siswa - Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"><div><h1 class="text-3xl font-bold text-slate-800 tracking-tight">Manajemen Siswa</h1> <p class="text-slate-500 mt-1">Kelola data siswa dan kelasnya.</p></div> <button class="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Tambah Siswa</button></div> `);
    if (isAdding) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in"><h2 class="text-xl font-bold text-slate-800 mb-4">Tambah Siswa Baru</h2> <form method="POST" action="?/add" class="space-y-4 max-w-lg"><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label> <input type="text" id="name" name="name" class="input" required="" placeholder="Nama Siswa"/></div> <div><label for="nisn" class="block text-sm font-medium text-slate-700 mb-1">NISN <span class="text-red-500">*</span></label> <input type="text" id="nisn" name="nisn" class="input" required="" placeholder="10 Digit NISN"/> <p class="text-xs text-slate-500 mt-1">NISN juga akan menjadi Password login.</p></div></div> <div><label for="class_id" class="block text-sm font-medium text-slate-700 mb-1">Kelas</label> <select id="class_id" name="class_id" class="input">`);
      $$renderer2.option({ value: "" }, ($$renderer3) => {
        $$renderer3.push(`Pilih Kelas (Opsional)`);
      });
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(data.classes);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let cls = each_array[$$index];
        $$renderer2.option({ value: cls.id }, ($$renderer3) => {
          $$renderer3.push(`${escape_html(cls.name)}`);
        });
      }
      $$renderer2.push(`<!--]--></select></div> <div class="flex space-x-3 pt-2"><button type="submit" class="btn btn-primary">Simpan Siswa</button> <button type="button" class="btn btn-secondary">Batal</button></div></form></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (editingUser) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in mb-6"><h2 class="text-xl font-bold text-slate-800 mb-4">Edit Siswa</h2> <form method="POST" action="?/edit" class="space-y-4 max-w-lg"><input type="hidden" name="id"${attr("value", editingUser.id)}/> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label for="e-name" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label> <input type="text" id="e-name" name="name" class="input" required=""${attr("value", editingUser.name)}/></div> <div><label for="e-nisn" class="block text-sm font-medium text-slate-700 mb-1">NISN <span class="text-red-500">*</span></label> <input type="text" id="e-nisn" name="nisn" class="input" required=""${attr("value", editingUser.username)}/> <p class="text-xs text-slate-500 mt-1">Mengubah NISN akan mereset Password.</p></div></div> <div><label for="e-class_id" class="block text-sm font-medium text-slate-700 mb-1">Kelas</label> <select id="e-class_id" name="class_id" class="input">`);
      $$renderer2.option({ value: "" }, ($$renderer3) => {
        $$renderer3.push(`Pilih Kelas (Opsional)`);
      });
      $$renderer2.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(data.classes);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let cls = each_array_1[$$index_1];
        $$renderer2.option({ value: cls.id, selected: cls.id == editingUser.class_id }, ($$renderer3) => {
          $$renderer3.push(`${escape_html(cls.name)}`);
        });
      }
      $$renderer2.push(`<!--]--></select></div> <div class="flex space-x-3 pt-2"><button type="submit" class="btn btn-primary">Simpan Perubahan</button> <button type="button" class="btn btn-secondary">Batal</button></div></form></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col"><div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50"><form class="relative w-full max-w-md" method="GET" action=""><input type="hidden" name="class"${attr("value", filterClass)}/> <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> <input type="search" name="search" placeholder="Cari nama atau username..." class="input pl-10 bg-white"/></form> <div class="w-full sm:w-48">`);
    $$renderer2.select({ class: "input bg-white", value: filterClass }, ($$renderer3) => {
      $$renderer3.option({ value: "" }, ($$renderer4) => {
        $$renderer4.push(`Semua Kelas`);
      });
      $$renderer3.push(`<!--[-->`);
      const each_array_2 = ensure_array_like(data.classes);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let cls = each_array_2[$$index_2];
        $$renderer3.option({ value: cls.id }, ($$renderer4) => {
          $$renderer4.push(`${escape_html(cls.name)}`);
        });
      }
      $$renderer3.push(`<!--]-->`);
    });
    $$renderer2.push(`</div></div> <div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-slate-50 text-slate-500 text-sm"><th class="p-4 font-semibold">Siswa</th><th class="p-4 font-semibold">Kelas</th><th class="p-4 font-semibold">Status</th><th class="p-4 font-semibold">Terdaftar</th><th class="p-4 font-semibold text-right">Aksi</th></tr></thead><tbody class="divide-y divide-slate-100 text-slate-700">`);
    const each_array_3 = ensure_array_like(data.users);
    if (each_array_3.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let user = each_array_3[$$index_3];
        $$renderer2.push(`<tr class="hover:bg-slate-50/80 transition-colors"><td class="p-4"><div class="flex items-center space-x-3"><div class="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">${escape_html(user.name.charAt(0).toUpperCase())}</div> <div><div class="font-medium text-slate-900">${escape_html(user.name)}</div> <div class="text-sm text-slate-500">${escape_html(user.username)}</div></div></div></td><td class="p-4">`);
        if (user.class_name) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">${escape_html(user.class_name)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="text-sm text-slate-400">-</span>`);
        }
        $$renderer2.push(`<!--]--></td><td class="p-4">`);
        if (user.is_active) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge badge-success">Aktif</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="badge badge-danger">Nonaktif</span>`);
        }
        $$renderer2.push(`<!--]--></td><td class="p-4 text-sm text-slate-500">${escape_html(new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }))}</td><td class="p-4 text-right"><div class="flex items-center justify-end space-x-2"><button class="btn-ghost btn-sm">Edit</button> <form method="POST" action="?/toggleStatus" class="inline-block"><input type="hidden" name="id"${attr("value", user.id)}/> <input type="hidden" name="is_active"${attr("value", user.is_active)}/> <button type="submit"${attr_class(`btn-ghost btn-sm ${user.is_active ? "text-amber-600" : "text-green-600"}`)}>${escape_html(user.is_active ? "Nonaktif" : "Aktif")}</button></form> `);
        ConfirmForm($$renderer2, {
          action: "?/delete",
          confirmTitle: "Hapus Siswa",
          confirmMessage: "Hapus siswa ini? Semua rekam jejak ujiannya akan ikut terhapus permanen!",
          buttonClass: "btn-ghost btn-sm text-red-600",
          buttonTitle: "Hapus",
          $$slots: {
            inputs: ($$renderer3) => {
              {
                $$renderer3.push(`<input type="hidden" name="id"${attr("value", user.id)}/>`);
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
      $$renderer2.push(`<tr><td colspan="5" class="p-12 text-center"><div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3-2.803a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div> <h3 class="text-lg font-medium text-slate-900 mb-1">Tidak ada data siswa</h3> <p class="text-slate-500">Gunakan pencarian atau filter untuk menemukan siswa, atau tambahkan siswa baru.</p></td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div></div>`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
