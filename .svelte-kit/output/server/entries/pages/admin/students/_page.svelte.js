import { l as fallback, j as attr, d as bind_props, f as ensure_array_like, e as escape_html, h as head, i as attr_class, b as stringify } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import { p as public_env } from "../../../../chunks/shared-server.js";
import "../../../../chunks/state.svelte.js";
import { C as ConfirmForm } from "../../../../chunks/ConfirmForm.js";
import { t as toasts } from "../../../../chunks/toast.js";
import { I as ICONS } from "../../../../chunks/constants.js";
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
      $$renderer2.push(`<!--]--> <div class="space-y-6"><div class="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5"><h3 class="font-bold text-indigo-900 mb-2 flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Langkah Import</h3> <ol class="list-decimal list-inside text-sm text-indigo-800 space-y-2 ml-1"><li>Unduh template Excel yang disediakan.</li> <li>Isi data siswa sesuai format (Kolom <strong>NISN</strong>, <strong>NAMA LENGKAP</strong>, <strong>NAMA KELAS</strong>, <strong>TEMPAT LAHIR</strong>, <strong>TANGGAL LAHIR</strong> (YYYY-MM-DD)).</li> <li>Lihat sheet <strong>Referensi Kelas</strong> untuk panduan nama kelas.</li> <li>Simpan dan unggah kembali file Excel tersebut.</li></ol> <button class="mt-5 w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-4 p-4 text-left"><div class="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg></div> <div class="flex-1 min-w-0"><p class="font-bold text-white text-sm">Unduh Template Excel</p> <p class="text-indigo-200 text-xs mt-0.5">Format siap pakai dengan Referensi Kelas</p></div> <svg class="w-5 h-5 text-indigo-200 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out pointer-events-none"></div></button></div> <div><label class="block text-sm font-medium text-slate-700 mb-2">Pilih File Excel (.xlsx)</label> <input type="file" accept=".xlsx, .xls" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-slate-200 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"${attr("disabled", isParsing, true)}/></div></div> <form method="POST" action="?/importExcel" class="hidden"><input type="hidden" name="students_json"${attr("value", JSON.stringify(parsedData))}/> <button type="submit" id="submit-import-students-btn" aria-label="Submit Form"></button></form></div> <div class="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0"><button class="btn btn-secondary"${attr("disabled", isParsing, true)}>Batal</button> <button class="btn btn-primary min-w-[120px]"${attr("disabled", true, true)}>`);
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
function LoginCardModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let show = fallback($$props["show"], false);
    let classes = fallback($$props["classes"], () => [], true);
    let students = fallback($$props["students"], () => [], true);
    let schoolName = fallback($$props["schoolName"], "");
    let schoolLogo = fallback($$props["schoolLogo"], "");
    let selectedClassId = "";
    classes.find((c) => String(c.id) === String(selectedClassId))?.name ?? "";
    if (show) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4"><div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" role="button" tabindex="-1" aria-label="Tutup modal"></div> <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden login-card-modal svelte-5515a0"><div class="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-violet-50"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"></path></svg></div> <div><h2 class="text-lg font-bold text-slate-800">Kartu Login Siswa</h2> <p class="text-xs text-slate-500">Cetak kartu login per kelas</p></div></div> <button class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-colors" aria-label="Tutup"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div> <div class="p-5 overflow-y-auto flex-1 space-y-5"><div class="mb-6"><div><label for="class-select" class="block text-sm font-semibold text-slate-700 mb-2">Pilih Kelas</label> `);
      $$renderer2.select({ id: "class-select", class: "input", value: selectedClassId }, ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`-- Pilih kelas --`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(classes);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let cls = each_array[$$index];
          $$renderer3.option({ value: String(cls.id) }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(cls.name)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      });
      $$renderer2.push(`</div></div> `);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-6 text-center"><div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3"><svg class="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"></path></svg></div> <p class="text-sm font-medium text-slate-400">Pilih kelas untuk melihat pratinjau kartu login siswa</p></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3"><button class="btn btn-secondary">Batal</button> <button class="btn btn-primary gap-2"${attr("disabled", !selectedClassId, true)}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak / Unduh Kartu</button></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { show, classes, students, schoolName, schoolLogo });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let isAllSelected;
    let data = $$props["data"];
    let form = $$props["form"];
    let isAdding = false;
    let showImportModal = false;
    let showLoginCardModal = false;
    let showBulkDeleteModal = false;
    let editingUser = null;
    let filterClass = "";
    let selectedIds = [];
    let isUploadingPhotoFor = null;
    public_env.PUBLIC_CLOUDINARY_CLOUD_NAME || "dfhtjgwcz";
    public_env.PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ujian-madrasah";
    function getClassColor(classId) {
      if (!classId) return "bg-slate-100 text-slate-600";
      const colors = [
        "bg-blue-100 text-blue-700",
        "bg-emerald-100 text-emerald-700",
        "bg-amber-100 text-amber-700",
        "bg-purple-100 text-purple-700",
        "bg-pink-100 text-pink-700",
        "bg-indigo-100 text-indigo-700",
        "bg-teal-100 text-teal-700",
        "bg-rose-100 text-rose-700"
      ];
      const index = Number(classId) % colors.length;
      return colors[index];
    }
    function formatBirth(place, dateStr) {
      if (!place && !dateStr) return "-";
      let formattedDate = "";
      if (dateStr) {
        try {
          formattedDate = new Date(String(dateStr).replace(" ", "T")).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
        } catch {
          formattedDate = dateStr;
        }
      }
      if (place && formattedDate) return `${place}, ${formattedDate}`;
      return place || formattedDate || "-";
    }
    if (form?.error) {
      toasts.error(form.error);
    } else if (form?.success) {
      toasts.success(form.message || "Berhasil menyimpan data siswa");
      isAdding = false;
      showImportModal = false;
      showBulkDeleteModal = false;
      editingUser = null;
      selectedIds = [];
    }
    isAllSelected = data.users.length > 0 && selectedIds.length === data.users.length;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("19at0ld", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Siswa - Admin</title>`);
        });
      });
      $$renderer3.push(`<input type="file" accept="image/*" class="hidden"/> <div class="space-y-6"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"><div><h1 class="text-3xl font-bold text-slate-800 tracking-tight">Manajemen Siswa</h1> <p class="text-slate-500 mt-1">Kelola data siswa dan kelasnya.</p></div> <div class="flex flex-wrap items-center gap-3">`);
      if (selectedIds.length > 0) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<button class="btn btn-danger flex-1 sm:flex-none animate-bounce-in"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Hapus Massal (${escape_html(selectedIds.length)})</button>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <button class="btn flex-1 sm:flex-none" style="background: linear-gradient(135deg,#f59e0b,#f97316); color:#fff; box-shadow: 0 4px 15px rgba(245,158,11,.3);"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"></path></svg> Kartu Login</button> <button class="btn btn-secondary flex-1 sm:flex-none"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> Import Excel</button> <button class="btn btn-primary flex-1 sm:flex-none"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Tambah Siswa</button></div></div> `);
      if (isAdding) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-h-[90vh] overflow-y-auto w-full max-w-lg animate-bounce-in"><h2 class="text-xl font-bold text-slate-800 mb-4">Tambah Siswa Baru</h2> <form method="POST" action="?/add" class="space-y-4 max-w-lg"><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label> <input type="text" id="name" name="name" class="input" required="" placeholder="Nama Siswa"/></div> <div><label for="nisn" class="block text-sm font-medium text-slate-700 mb-1">NISN <span class="text-red-500">*</span></label> <input type="text" id="nisn" name="nisn" class="input" required="" placeholder="10 Digit NISN"/> <p class="text-xs text-slate-500 mt-1">NISN juga akan menjadi Password login.</p></div></div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label for="place_of_birth" class="block text-sm font-medium text-slate-700 mb-1">Tempat Lahir</label> <input type="text" id="place_of_birth" name="place_of_birth" class="input" placeholder="Kota Kelahiran"/></div> <div><label for="date_of_birth" class="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label> <input type="date" id="date_of_birth" name="date_of_birth" class="input"/></div></div> <div><label for="class_id" class="block text-sm font-medium text-slate-700 mb-1">Kelas</label> <select id="class_id" name="class_id" class="input">`);
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
        $$renderer3.push(`<!--]--></select></div> <div class="flex space-x-3 pt-2"><button type="submit" class="btn btn-primary">Simpan Siswa</button> <button type="button" class="btn btn-secondary">Batal</button></div></form></div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (editingUser) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-h-[90vh] overflow-y-auto w-full max-w-lg animate-bounce-in"><h2 class="text-xl font-bold text-slate-800 mb-4">Edit Siswa</h2> <form method="POST" action="?/edit" class="space-y-4 max-w-lg"><input type="hidden" name="id"${attr("value", editingUser.id)}/> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label for="e-name" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label> <input type="text" id="e-name" name="name" class="input" required=""${attr("value", editingUser.name)}/></div> <div><label for="e-nisn" class="block text-sm font-medium text-slate-700 mb-1">NISN <span class="text-red-500">*</span></label> <input type="text" id="e-nisn" name="nisn" class="input" required=""${attr("value", editingUser.username)}/> <p class="text-xs text-slate-500 mt-1">Mengubah NISN akan mereset Password.</p></div></div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label for="e-place_of_birth" class="block text-sm font-medium text-slate-700 mb-1">Tempat Lahir</label> <input type="text" id="e-place_of_birth" name="place_of_birth" class="input"${attr("value", editingUser.place_of_birth || "")}/></div> <div><label for="e-date_of_birth" class="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label> <input type="date" id="e-date_of_birth" name="date_of_birth" class="input"${attr("value", editingUser.date_of_birth || "")}/></div></div> <div><label for="e-class_id" class="block text-sm font-medium text-slate-700 mb-1">Kelas</label> <select id="e-class_id" name="class_id" class="input">`);
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
        $$renderer3.push(`<!--]--></select></div> <div class="flex space-x-3 pt-2"><button type="submit" class="btn btn-primary">Simpan Perubahan</button> <button type="button" class="btn btn-secondary">Batal</button></div></form></div></div>`);
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
      $$renderer3.push(`</div></div> `);
      if (selectedIds.length > 0) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="bg-indigo-50 border-b border-indigo-100 p-3 px-4 flex items-center justify-between animate-fade-in"><div class="text-sm font-medium text-indigo-900 flex items-center gap-2"><span class="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">${escape_html(selectedIds.length)}</span> <span>Siswa dipilih</span></div> <div class="flex items-center gap-2"><button class="btn btn-sm btn-danger">Hapus Massal (${escape_html(selectedIds.length)})</button> <button class="btn btn-sm btn-secondary">Batal Pilih</button></div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-slate-50 text-slate-500 text-sm"><th class="p-4 w-12 text-center whitespace-nowrap"><input type="checkbox"${attr("checked", isAllSelected, true)} class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" title="Pilih Semua Siswa"/></th><th class="p-4 font-semibold whitespace-nowrap">Siswa</th><th class="p-4 font-semibold whitespace-nowrap">Kelas</th><th class="p-4 font-semibold whitespace-nowrap">Tempat, Tgl Lahir</th><th class="p-4 font-semibold whitespace-nowrap">Status</th><th class="p-4 font-semibold text-right whitespace-nowrap">Aksi</th></tr></thead><tbody class="divide-y divide-slate-100 text-slate-700">`);
      const each_array_3 = ensure_array_like(data.users);
      if (each_array_3.length !== 0) {
        $$renderer3.push("<!--[-->");
        for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
          let user = each_array_3[$$index_3];
          $$renderer3.push(`<tr${attr_class(`hover:bg-slate-50/80 transition-colors ${selectedIds.includes(user.id) ? "bg-indigo-50/40" : ""}`)}><td class="p-4 text-center whitespace-nowrap"><input type="checkbox"${attr("checked", selectedIds.includes(user.id), true)} class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"/></td><td class="p-4 whitespace-nowrap"><div class="flex items-center space-x-3"><button type="button" class="relative h-10 w-10 shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold overflow-hidden group cursor-pointer border border-slate-200 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-1 transition-all" title="Klik untuk mengubah foto">`);
          if (isUploadingPhotoFor === user.id) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm z-10"><div class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> `);
          if (user.photo) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<img${attr("src", user.photo)}${attr("alt", user.name)} class="w-full h-full object-cover"/>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`${escape_html(user.name.charAt(0).toUpperCase())}`);
          }
          $$renderer3.push(`<!--]--> <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div></button> <div class="whitespace-nowrap"><div${attr_class(`font-medium whitespace-nowrap ${user.class_id ? "text-slate-900" : "text-red-600 drop-shadow-sm"}`)}>${escape_html(user.name)}</div> <div class="text-sm text-slate-500 whitespace-nowrap">@${escape_html(user.username)}</div></div></div></td><td class="p-4 whitespace-nowrap">`);
          if (user.class_name) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<span${attr_class(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${stringify(getClassColor(user.class_id))}`)}>${escape_html(user.class_name)}</span>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<span class="text-sm text-slate-400 whitespace-nowrap">-</span>`);
          }
          $$renderer3.push(`<!--]--></td><td class="p-4 text-sm text-slate-600 whitespace-nowrap">${escape_html(formatBirth(user.place_of_birth, user.date_of_birth))}</td><td class="p-4 whitespace-nowrap">`);
          if (user.is_active) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<span class="badge badge-success whitespace-nowrap">Aktif</span>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<span class="badge badge-danger whitespace-nowrap">Nonaktif</span>`);
          }
          $$renderer3.push(`<!--]--></td><td class="p-4 text-right whitespace-nowrap"><div class="flex items-center justify-end gap-1.5 whitespace-nowrap"><button type="button" class="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors shadow-xs" title="Edit Siswa"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.edit)}></path></svg></button> <form method="POST" action="?/toggleStatus" class="inline-block"><input type="hidden" name="id"${attr("value", user.id)}/> <input type="hidden" name="is_active"${attr("value", user.is_active)}/> `);
          if (user.is_active) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<button type="submit" class="p-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-colors shadow-xs" title="Nonaktifkan Siswa"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg></button>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<button type="submit" class="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors shadow-xs" title="Aktifkan Siswa"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>`);
          }
          $$renderer3.push(`<!--]--></form> `);
          ConfirmForm($$renderer3, {
            action: "?/delete",
            confirmTitle: "Hapus Siswa",
            confirmMessage: "Hapus siswa ini? Semua rekam jejak ujiannya akan ikut terhapus permanen!",
            buttonClass: "p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors shadow-xs",
            buttonTitle: "Hapus Siswa",
            $$slots: {
              inputs: ($$renderer4) => {
                {
                  $$renderer4.push(`<input type="hidden" name="id"${attr("value", user.id)}/>`);
                }
              },
              buttonContent: ($$renderer4) => {
                {
                  $$renderer4.push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.trash)}></path></svg>`);
                }
              }
            }
          });
          $$renderer3.push(`<!----></div></td></tr>`);
        }
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push(`<tr><td colspan="6" class="p-12 text-center"><div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3-2.803a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div> <h3 class="text-lg font-medium text-slate-900 mb-1">Tidak ada data siswa</h3> <p class="text-slate-500">Gunakan pencarian atau filter untuk menemukan siswa, atau tambahkan siswa baru.</p></td></tr>`);
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
      $$renderer3.push(`<!----> `);
      LoginCardModal($$renderer3, {
        classes: data.classes,
        students: data.users,
        schoolName: data.schoolName,
        schoolLogo: data.schoolLogo,
        get show() {
          return showLoginCardModal;
        },
        set show($$value) {
          showLoginCardModal = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (showBulkDeleteModal) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-h-[90vh] overflow-y-auto w-full max-w-md animate-bounce-in text-center"><div class="w-14 h-14 mx-auto rounded-full bg-rose-100 flex items-center justify-center mb-4 text-rose-600"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></div> <h3 class="text-xl font-bold text-slate-800 mb-2">Hapus Massal Siswa (${escape_html(selectedIds.length)})?</h3> <p class="text-sm text-slate-500 mb-6">Apakah Anda yakin ingin menghapus <strong>${escape_html(selectedIds.length)} siswa</strong> terpilih? Semua data rekam jejak ujian mereka akan terhapus secara permanen.</p> <form method="POST" action="?/deleteBulk"><input type="hidden" name="ids"${attr("value", JSON.stringify(selectedIds))}/> <div class="flex space-x-3"><button type="button" class="btn btn-secondary flex-1">Batal</button> <button type="submit" class="btn btn-danger flex-1">Ya, Hapus Semua</button></div></form></div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
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
