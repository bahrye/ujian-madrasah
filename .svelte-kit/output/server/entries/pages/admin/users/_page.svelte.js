import { l as fallback, j as attr, d as bind_props, h as head, f as ensure_array_like, e as escape_html, i as attr_class, b as stringify } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { I as ICONS, b as ROLE_COLORS, R as ROLE_LABELS } from "../../../../chunks/constants.js";
import { t as toasts } from "../../../../chunks/toast.js";
import { P as PasswordInput } from "../../../../chunks/PasswordInput.js";
function ImportUsersModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let show = fallback($$props["show"], false);
    let isParsing = false;
    let parsedData = [];
    if (show) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-[100] flex items-center justify-center"><div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"></div> <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"><div class="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10"><h2 class="text-xl font-bold text-slate-800">Import Data Pengguna</h2> <button class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div> <div class="p-6 overflow-y-auto">`);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="space-y-6"><div class="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5"><h3 class="font-bold text-indigo-900 mb-2 flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Langkah Import</h3> <ol class="list-decimal list-inside text-sm text-indigo-800 space-y-2 ml-1"><li>Unduh template Excel yang disediakan.</li> <li>Isi data pengguna sesuai format (Username, Nama Lengkap, Password, Role).</li> <li>Pastikan Role hanya berisi: <strong>guru</strong> atau <strong>pengawas</strong>.</li> <li>Simpan dan unggah kembali file Excel tersebut.</li></ol> <button class="mt-5 w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-4 p-4 text-left"><div class="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg></div> <div class="flex-1 min-w-0"><p class="font-bold text-white text-sm">Unduh Template Excel</p> <p class="text-indigo-200 text-xs mt-0.5">Format siap pakai dengan Petunjuk Pengisian</p></div> <svg class="w-5 h-5 text-indigo-200 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out pointer-events-none"></div></button></div> <div><label class="block text-sm font-medium text-slate-700 mb-2">Pilih File Excel (.xlsx)</label> <input type="file" accept=".xlsx, .xls" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-slate-200 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"${attr("disabled", isParsing, true)}/></div></div> <form method="POST" action="?/importExcel" class="hidden"><input type="hidden" name="users_json"${attr("value", JSON.stringify(parsedData))}/> <button type="submit" id="submit-import-users-btn" aria-label="Submit Form"></button></form></div> <div class="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0"><button class="btn btn-secondary"${attr("disabled", isParsing, true)}>Batal</button> <button class="btn btn-primary min-w-[120px]"${attr("disabled", true, true)}>`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`Import Data`);
      }
      $$renderer2.push(`<!--]--></button></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { show });
  });
}
function AdminLoginCardModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let show = fallback($$props["show"], false);
    let users = fallback($$props["users"], () => [], true);
    let schoolName = fallback($$props["schoolName"], "");
    let schoolLogo = fallback($$props["schoolLogo"], "");
    let selectedRole = "";
    if (show) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4"><div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" role="button" tabindex="-1" aria-label="Tutup modal"></div> <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden login-card-modal svelte-fxef8b"><div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20"><svg class="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"></path></svg></div> <div><h2 class="text-xl font-bold">Kartu Login Petugas</h2> <p class="text-sm text-slate-400 font-medium">Cetak kartu akses sistem</p></div></div> <button class="text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-xl transition-colors" aria-label="Tutup"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div> <div class="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50"><div><label for="role-select" class="block text-sm font-bold text-slate-700 mb-2">Pilih Role Petugas</label> `);
      $$renderer2.select(
        {
          id: "role-select",
          class: "input bg-white shadow-sm border-slate-200",
          value: selectedRole
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "" }, ($$renderer4) => {
            $$renderer4.push(`-- Pilih role --`);
          });
          $$renderer3.option({ value: "guru" }, ($$renderer4) => {
            $$renderer4.push(`Guru`);
          });
          $$renderer3.option({ value: "pengawas" }, ($$renderer4) => {
            $$renderer4.push(`Pengawas`);
          });
        }
      );
      $$renderer2.push(`</div> `);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="bg-slate-100 border border-slate-200 border-dashed rounded-3xl p-8 text-center"><div class="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-200"><svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"></path></svg></div> <p class="text-sm font-bold text-slate-500">Pilih role untuk melihat pratinjau kartu</p></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="p-6 border-t border-slate-100 bg-white flex items-center justify-end gap-3"><button class="btn btn-secondary shadow-sm">Batal</button> <button class="btn bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/20 gap-2 font-bold px-5"${attr("disabled", !selectedRole, true)}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak Kartu Login</button></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { show, users, schoolName, schoolLogo });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let form = $$props["form"];
    let showCreateModal = false;
    let showImportModal = false;
    let showLoginCardModal = false;
    if (form?.success) {
      toasts.success(form.success);
      showImportModal = false;
      showCreateModal = false;
    }
    if (form?.error) toasts.error(form.error);
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1p497kv", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Manajemen Pengguna — Ujian Online Madrasah</title>`);
        });
      });
      $$renderer3.push(`<div class="space-y-6 animate-in"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-2xl font-bold text-slate-800">Manajemen Pengguna</h1> <p class="text-sm text-slate-500 mt-1">Kelola data pengguna sistem</p></div> <div class="flex gap-2"><button class="btn" style="background: linear-gradient(135deg,#0ea5e9,#3b82f6); color:#fff; box-shadow: 0 4px 15px rgba(14,165,233,.3);"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"></path></svg> Kartu Login</button> <button class="btn-secondary"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> Import Excel</button> <button class="btn-primary"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.plus)}></path></svg> Tambah Pengguna</button></div></div> <div class="card p-4"><form method="GET" class="flex flex-col sm:flex-row gap-3"><div class="relative flex-1"><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.search)}></path></svg> <input name="search" type="text" class="input pl-9" placeholder="Cari pengguna..."${attr("value", data.search)}/></div> <select name="role" class="select w-full sm:w-40">`);
      $$renderer3.option({ value: "" }, ($$renderer4) => {
        $$renderer4.push(`Semua Role`);
      });
      $$renderer3.option({ value: "guru", selected: data.roleFilter === "guru" }, ($$renderer4) => {
        $$renderer4.push(`Guru`);
      });
      $$renderer3.option({ value: "pengawas", selected: data.roleFilter === "pengawas" }, ($$renderer4) => {
        $$renderer4.push(`Pengawas`);
      });
      $$renderer3.push(`</select> <button type="submit" class="btn-secondary btn-sm">Cari</button></form></div> <div class="card overflow-hidden"><div class="table-container border-0 rounded-none"><table class="table"><thead><tr class="bg-slate-50 text-slate-500 text-sm"><th class="p-4 font-semibold whitespace-nowrap">Nama</th><th class="p-4 font-semibold whitespace-nowrap">Username</th><th class="p-4 font-semibold whitespace-nowrap">Role</th><th class="p-4 font-semibold whitespace-nowrap">Status</th><th class="p-4 font-semibold whitespace-nowrap">Dibuat</th><th class="p-4 font-semibold text-right whitespace-nowrap">Aksi</th></tr></thead><tbody class="divide-y divide-slate-100 text-slate-700">`);
      const each_array = ensure_array_like(data.users);
      if (each_array.length !== 0) {
        $$renderer3.push("<!--[-->");
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let user = each_array[$$index];
          $$renderer3.push(`<tr class="hover:bg-slate-50/80 transition-colors"><td class="p-4 font-semibold text-slate-800 whitespace-nowrap">${escape_html(user.name)}</td><td class="p-4 text-slate-600 whitespace-nowrap">@${escape_html(user.username)}</td><td class="p-4 whitespace-nowrap"><span${attr_class(`${stringify(ROLE_COLORS[user.role] || "badge-info")} whitespace-nowrap`)}>${escape_html(ROLE_LABELS[user.role] || user.role)}</span></td><td class="p-4 whitespace-nowrap">`);
          if (user.is_active) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<span class="badge-success whitespace-nowrap">Aktif</span>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<span class="badge-danger whitespace-nowrap">Nonaktif</span>`);
          }
          $$renderer3.push(`<!--]--></td><td class="p-4 text-xs text-slate-500 whitespace-nowrap">${escape_html((/* @__PURE__ */ new Date(String(user.created_at).replace(" ", "T") + (String(user.created_at).includes(" ") && !String(user.created_at).includes("Z") ? "Z" : ""))).toLocaleDateString("id-ID"))}</td><td class="p-4 text-right whitespace-nowrap"><div class="flex items-center justify-end gap-1.5 whitespace-nowrap"><button type="button" class="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors shadow-xs" title="Edit Pengguna"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.edit)}></path></svg></button> `);
          if (user.is_active) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<button type="button" class="p-2 rounded-xl bg-slate-100 text-slate-300 cursor-not-allowed opacity-60 shadow-xs" disabled="" title="Nonaktifkan pengguna terlebih dahulu sebelum menghapus"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.trash)}></path></svg></button>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<button type="button" class="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors shadow-xs" title="Hapus Pengguna Nonaktif"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.trash)}></path></svg></button>`);
          }
          $$renderer3.push(`<!--]--></div></td></tr>`);
        }
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push(`<tr><td colspan="6" class="text-center py-8 text-slate-400 whitespace-nowrap">Tidak ada pengguna ditemukan.</td></tr>`);
      }
      $$renderer3.push(`<!--]--></tbody></table></div></div></div> `);
      if (showCreateModal) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"><div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-md animate-bounce-in"><h2 class="text-lg font-bold text-slate-800 mb-4">Tambah Pengguna Baru</h2> <form method="POST" action="?/create" class="space-y-4"><div><label for="create-name" class="label">Nama Lengkap</label> <input id="create-name" name="name" type="text" required="" class="input" placeholder="Nama lengkap"/></div> <div><label for="create-username" class="label">Username</label> <input id="create-username" name="username" type="text" required="" class="input" placeholder="Username untuk login"/></div> <div><label for="create-password" class="label">Kata Sandi</label> `);
        PasswordInput($$renderer3, {
          id: "create-password",
          name: "password",
          required: true,
          placeholder: "Kata sandi"
        });
        $$renderer3.push(`<!----></div> <div><label for="create-role" class="label">Role</label> <select id="create-role" name="role" required="" class="select">`);
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Pilih role`);
        });
        $$renderer3.option({ value: "guru" }, ($$renderer4) => {
          $$renderer4.push(`Guru`);
        });
        $$renderer3.option({ value: "pengawas" }, ($$renderer4) => {
          $$renderer4.push(`Pengawas`);
        });
        $$renderer3.push(`</select></div> <div class="flex gap-3 pt-2"><button type="button" class="btn-ghost flex-1">Batal</button> <button type="submit" class="btn-primary flex-1">Simpan</button></div></form></div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      ImportUsersModal($$renderer3, {
        get show() {
          return showImportModal;
        },
        set show($$value) {
          showImportModal = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      AdminLoginCardModal($$renderer3, {
        users: data.users,
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
