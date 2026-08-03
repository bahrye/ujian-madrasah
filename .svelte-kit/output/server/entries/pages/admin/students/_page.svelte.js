import { l as fallback, j as attr, d as bind_props, h as head, f as ensure_array_like, e as escape_html, i as attr_class } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { C as ConfirmForm } from "../../../../chunks/ConfirmForm.js";
import { t as toasts } from "../../../../chunks/toast.js";
function ImportStudentsModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let show = fallback($$props["show"], false);
    let classes = fallback($$props["classes"], () => [], true);
    let isParsing = false;
    let parsedData = [];
    if (show) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-[100] flex items-center justify-center"><div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"></div> <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"><div class="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10"><h2 class="text-xl font-bold text-slate-800">Import Data Siswa</h2> <button class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div> <div class="p-6 overflow-y-auto">`);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="space-y-6"><div class="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5"><h3 class="font-bold text-indigo-900 mb-2 flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Langkah Import</h3> <ol class="list-decimal list-inside text-sm text-indigo-800 space-y-2 ml-1"><li>Unduh template Excel yang disediakan.</li> <li>Isi data siswa sesuai format (Kolom <strong>NISN</strong>, <strong>NAMA LENGKAP</strong>, dan <strong>NAMA KELAS</strong>).</li> <li>Lihat sheet <strong>Referensi Kelas</strong> untuk panduan nama kelas.</li> <li>Simpan dan unggah kembali file Excel tersebut.</li></ol> <button class="mt-5 w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-4 p-4 text-left"><div class="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg></div> <div class="flex-1 min-w-0"><p class="font-bold text-white text-sm">Unduh Template Excel</p> <p class="text-indigo-200 text-xs mt-0.5">Format siap pakai dengan Referensi Kelas</p></div> <svg class="w-5 h-5 text-indigo-200 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out pointer-events-none"></div></button></div> <div><label class="block text-sm font-medium text-slate-700 mb-2">Pilih File Excel (.xlsx)</label> <input type="file" accept=".xlsx, .xls" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-slate-200 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"${attr("disabled", isParsing, true)}/></div></div> <form method="POST" action="?/importExcel" class="hidden"><input type="hidden" name="students_json"${attr("value", JSON.stringify(parsedData))}/> <button type="submit" id="submit-import-students-btn" aria-label="Submit Form"></button></form></div> <div class="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0"><button class="btn btn-secondary"${attr("disabled", isParsing, true)}>Batal</button> <button class="btn btn-primary min-w-[120px]"${attr("disabled", true, true)}>`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`Import Data`);
      }
      $$renderer2.push(`<!--]--></button></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { show, classes });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let form = $$props["form"];
    let isAdding = false;
    let showImportModal = false;
    let editingUser = null;
    let filterClass = "";
    if (form?.error) {
      toasts.error(form.error);
    } else if (form?.success) {
      toasts.success(form.message || "Berhasil menyimpan data siswa");
      isAdding = false;
      showImportModal = false;
      editingUser = null;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("19at0ld", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Siswa - Admin</title>`);
        });
      });
      $$renderer3.push(`<div class="space-y-6"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"><div><h1 class="text-3xl font-bold text-slate-800 tracking-tight">Manajemen Siswa</h1> <p class="text-slate-500 mt-1">Kelola data siswa dan kelasnya.</p></div> <div class="flex items-center gap-3"><button class="btn btn-secondary"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> Import Excel</button> <button class="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Tambah Siswa</button></div></div> `);
      if (isAdding) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in"><h2 class="text-xl font-bold text-slate-800 mb-4">Tambah Siswa Baru</h2> <form method="POST" action="?/add" class="space-y-4 max-w-lg"><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label> <input type="text" id="name" name="name" class="input" required="" placeholder="Nama Siswa"/></div> <div><label for="nisn" class="block text-sm font-medium text-slate-700 mb-1">NISN <span class="text-red-500">*</span></label> <input type="text" id="nisn" name="nisn" class="input" required="" placeholder="10 Digit NISN"/> <p class="text-xs text-slate-500 mt-1">NISN juga akan menjadi Password login.</p></div></div> <div><label for="class_id" class="block text-sm font-medium text-slate-700 mb-1">Kelas</label> <select id="class_id" name="class_id" class="input">`);
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Pilih Kelas (Opsional)`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(data.classes);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let cls = each_array[$$index];
          $$renderer3.option({ value: cls.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(cls.name)}`);
          });
        }
        $$renderer3.push(`<!--]--></select></div> <div class="flex space-x-3 pt-2"><button type="submit" class="btn btn-primary">Simpan Siswa</button> <button type="button" class="btn btn-secondary">Batal</button></div></form></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (editingUser) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in mb-6"><h2 class="text-xl font-bold text-slate-800 mb-4">Edit Siswa</h2> <form method="POST" action="?/edit" class="space-y-4 max-w-lg"><input type="hidden" name="id"${attr("value", editingUser.id)}/> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label for="e-name" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label> <input type="text" id="e-name" name="name" class="input" required=""${attr("value", editingUser.name)}/></div> <div><label for="e-nisn" class="block text-sm font-medium text-slate-700 mb-1">NISN <span class="text-red-500">*</span></label> <input type="text" id="e-nisn" name="nisn" class="input" required=""${attr("value", editingUser.username)}/> <p class="text-xs text-slate-500 mt-1">Mengubah NISN akan mereset Password.</p></div></div> <div><label for="e-class_id" class="block text-sm font-medium text-slate-700 mb-1">Kelas</label> <select id="e-class_id" name="class_id" class="input">`);
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Pilih Kelas (Opsional)`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(data.classes);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let cls = each_array_1[$$index_1];
          $$renderer3.option({ value: cls.id, selected: cls.id == editingUser.class_id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(cls.name)}`);
          });
        }
        $$renderer3.push(`<!--]--></select></div> <div class="flex space-x-3 pt-2"><button type="submit" class="btn btn-primary">Simpan Perubahan</button> <button type="button" class="btn btn-secondary">Batal</button></div></form></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col"><div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50"><form class="relative w-full max-w-md" method="GET" action=""><input type="hidden" name="class"${attr("value", filterClass)}/> <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> <input type="search" name="search" placeholder="Cari nama atau username..." class="input pl-10 bg-white"/></form> <div class="w-full sm:w-48">`);
      $$renderer3.select({ class: "input bg-white", value: filterClass }, ($$renderer4) => {
        $$renderer4.option({ value: "" }, ($$renderer5) => {
          $$renderer5.push(`Semua Kelas`);
        });
        $$renderer4.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(data.classes);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let cls = each_array_2[$$index_2];
          $$renderer4.option({ value: cls.id }, ($$renderer5) => {
            $$renderer5.push(`${escape_html(cls.name)}`);
          });
        }
        $$renderer4.push(`<!--]-->`);
      });
      $$renderer3.push(`</div></div> <div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-slate-50 text-slate-500 text-sm"><th class="p-4 font-semibold">Siswa</th><th class="p-4 font-semibold">Kelas</th><th class="p-4 font-semibold">Status</th><th class="p-4 font-semibold">Terdaftar</th><th class="p-4 font-semibold text-right">Aksi</th></tr></thead><tbody class="divide-y divide-slate-100 text-slate-700">`);
      const each_array_3 = ensure_array_like(data.users);
      if (each_array_3.length !== 0) {
        $$renderer3.push("<!--[-->");
        for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
          let user = each_array_3[$$index_3];
          $$renderer3.push(`<tr class="hover:bg-slate-50/80 transition-colors"><td class="p-4"><div class="flex items-center space-x-3"><div class="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">${escape_html(user.name.charAt(0).toUpperCase())}</div> <div><div class="font-medium text-slate-900">${escape_html(user.name)}</div> <div class="text-sm text-slate-500">${escape_html(user.username)}</div></div></div></td><td class="p-4">`);
          if (user.class_name) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">${escape_html(user.class_name)}</span>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<span class="text-sm text-slate-400">-</span>`);
          }
          $$renderer3.push(`<!--]--></td><td class="p-4">`);
          if (user.is_active) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<span class="badge badge-success">Aktif</span>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<span class="badge badge-danger">Nonaktif</span>`);
          }
          $$renderer3.push(`<!--]--></td><td class="p-4 text-sm text-slate-500">${escape_html((/* @__PURE__ */ new Date(String(user.created_at).replace(" ", "T") + (String(user.created_at).includes("Z") ? "" : "Z"))).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }))}</td><td class="p-4 text-right"><div class="flex items-center justify-end space-x-2"><button class="btn-ghost btn-sm">Edit</button> <form method="POST" action="?/toggleStatus" class="inline-block"><input type="hidden" name="id"${attr("value", user.id)}/> <input type="hidden" name="is_active"${attr("value", user.is_active)}/> <button type="submit"${attr_class(`btn-ghost btn-sm ${user.is_active ? "text-amber-600" : "text-green-600"}`)}>${escape_html(user.is_active ? "Nonaktif" : "Aktif")}</button></form> `);
          ConfirmForm($$renderer3, {
            action: "?/delete",
            confirmTitle: "Hapus Siswa",
            confirmMessage: "Hapus siswa ini? Semua rekam jejak ujiannya akan ikut terhapus permanen!",
            buttonClass: "btn-ghost btn-sm text-red-600",
            buttonTitle: "Hapus",
            $$slots: {
              inputs: ($$renderer4) => {
                {
                  $$renderer4.push(`<input type="hidden" name="id"${attr("value", user.id)}/>`);
                }
              },
              buttonContent: ($$renderer4) => {
                {
                  $$renderer4.push(`Hapus`);
                }
              }
            }
          });
          $$renderer3.push(`<!----></div></td></tr>`);
        }
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push(`<tr><td colspan="5" class="p-12 text-center"><div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3-2.803a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div> <h3 class="text-lg font-medium text-slate-900 mb-1">Tidak ada data siswa</h3> <p class="text-slate-500">Gunakan pencarian atau filter untuk menemukan siswa, atau tambahkan siswa baru.</p></td></tr>`);
      }
      $$renderer3.push(`<!--]--></tbody></table></div></div></div> `);
      ImportStudentsModal($$renderer3, {
        classes: data.classes,
        get show() {
          return showImportModal;
        },
        set show($$value) {
          showImportModal = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
