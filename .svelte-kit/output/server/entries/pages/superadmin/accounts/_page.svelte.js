import { h as head, e as escape_html, j as attr, f as ensure_array_like, d as bind_props } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { C as ConfirmForm } from "../../../../chunks/ConfirmForm.js";
import { P as PasswordInput } from "../../../../chunks/PasswordInput.js";
import { t as toasts } from "../../../../chunks/toast.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let form = $$props["form"];
    let showAddModal = false;
    if (form?.error) {
      toasts.error(form.error);
    } else if (form?.success) {
      toasts.success(form.success);
      showAddModal = false;
    }
    head("1tewrgk", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Akun Superadmin — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-8 animate-bounce-in"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div><h1 class="text-3xl font-bold text-slate-800 tracking-tight">Akun Superadmin</h1> <p class="text-slate-500 mt-1">Kelola profil kredensial Anda dan akun Superadmin sistem.</p></div> <button class="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg> Tambah Superadmin</button></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6"><div class="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100"><div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">${escape_html(data.currentUser.name.charAt(0).toUpperCase())}</div> <div><h2 class="text-lg font-bold text-slate-800">Profil Saya</h2> <p class="text-xs text-slate-500">Ubah nama, username, atau kata sandi</p></div></div> <form method="POST" action="?/updateSelf" class="space-y-4"><div><label for="self-name" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label> <input id="self-name" name="name" type="text" required="" class="input"${attr("value", data.currentUser.name)}/></div> <div><label for="self-username" class="block text-sm font-medium text-slate-700 mb-1">Username <span class="text-red-500">*</span></label> <input id="self-username" name="username" type="text" required="" class="input"${attr("value", data.currentUser.username)}/></div> <div><label for="self-password" class="block text-sm font-medium text-slate-700 mb-1">Kata Sandi Baru <span class="text-slate-400 font-normal">(opsional)</span></label> `);
    PasswordInput($$renderer2, {
      id: "self-password",
      name: "password",
      required: false,
      placeholder: "Kosongkan jika tidak diubah"
    });
    $$renderer2.push(`<!----></div> <div class="pt-2"><button type="submit" class="btn btn-primary w-full justify-center">Simpan Perubahan</button></div></form></div> <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col"><div class="p-6 border-b border-slate-100 bg-slate-50/50"><h2 class="text-lg font-bold text-slate-800">Daftar Akun Superadmin</h2> <p class="text-xs text-slate-500 mt-0.5">Seluruh akun yang memiliki akses penuh ke sistem.</p></div> <div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-slate-50 text-slate-500 text-sm"><th class="p-4 font-semibold">Pengguna</th><th class="p-4 font-semibold">Username</th><th class="p-4 font-semibold">Terdaftar</th><th class="p-4 font-semibold text-right">Aksi</th></tr></thead><tbody class="divide-y divide-slate-100 text-slate-700">`);
    const each_array = ensure_array_like(data.superadmins);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let sa = each_array[$$index];
        $$renderer2.push(`<tr class="hover:bg-slate-50/80 transition-colors"><td class="p-4"><div class="flex items-center space-x-3"><div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center">${escape_html(sa.name.charAt(0).toUpperCase())}</div> <span class="font-medium text-slate-900">${escape_html(sa.name)}</span> `);
        if (sa.id === data.currentUser.id) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge badge-success text-[10px]">Akun Anda</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></td><td class="p-4 text-sm text-slate-600">@${escape_html(sa.username)}</td><td class="p-4 text-xs text-slate-500">${escape_html((/* @__PURE__ */ new Date(String(sa.created_at).replace(" ", "T") + (String(sa.created_at).includes("Z") ? "" : "Z"))).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }))}</td><td class="p-4 text-right">`);
        if (sa.id === data.currentUser.id) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-xs text-slate-400 italic">Aktif</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          ConfirmForm($$renderer2, {
            action: "?/deleteSuperadmin",
            confirmTitle: "Hapus Superadmin",
            confirmMessage: "Apakah Anda yakin ingin menghapus akun Superadmin ini?",
            buttonClass: "btn-ghost btn-sm text-red-600 hover:bg-red-50",
            buttonTitle: "Hapus",
            $$slots: {
              inputs: ($$renderer3) => {
                {
                  $$renderer3.push(`<input type="hidden" name="id"${attr("value", sa.id)}/>`);
                }
              },
              buttonContent: ($$renderer3) => {
                {
                  $$renderer3.push(`Hapus`);
                }
              }
            }
          });
        }
        $$renderer2.push(`<!--]--></td></tr>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<tr><td colspan="4" class="p-8 text-center text-slate-400">Tidak ada akun superadmin.</td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div></div></div> `);
    if (showAddModal) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-h-[90vh] overflow-y-auto w-full max-w-md animate-bounce-in"><h2 class="text-xl font-bold text-slate-800 mb-4">Tambah Superadmin Baru</h2> <form method="POST" action="?/createSuperadmin" class="space-y-4"><div><label for="create-sa-name" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label> <input id="create-sa-name" name="name" type="text" required="" class="input" placeholder="Nama lengkap"/></div> <div><label for="create-sa-username" class="block text-sm font-medium text-slate-700 mb-1">Username <span class="text-red-500">*</span></label> <input id="create-sa-username" name="username" type="text" required="" class="input" placeholder="username_superadmin"/></div> <div><label for="create-sa-password" class="block text-sm font-medium text-slate-700 mb-1">Kata Sandi <span class="text-red-500">*</span></label> `);
      PasswordInput($$renderer2, {
        id: "create-sa-password",
        name: "password",
        required: true,
        placeholder: "Minimal 6 karakter"
      });
      $$renderer2.push(`<!----></div> <div class="flex space-x-3 pt-2"><button type="submit" class="btn btn-primary flex-1">Simpan Superadmin</button> <button type="button" class="btn btn-secondary flex-1">Batal</button></div></form></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
