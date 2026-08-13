import { h as head, k as attr, e as escape_html, j as attr_class, i as ensure_array_like, f as bind_props } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import { p as public_env } from "../../../../chunks/shared-server.js";
import "../../../../chunks/state.svelte.js";
import { t as toasts } from "../../../../chunks/toast.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let school;
    let data = $$props["data"];
    let form = $$props["form"];
    let logoUrl = data.school?.logo_url || "";
    let isUploading = false;
    public_env.PUBLIC_CLOUDINARY_CLOUD_NAME || "dfhtjgwcz";
    public_env.PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ujian-madrasah";
    const ACCREDITATIONS = ["A", "B", "C", "Belum Terakreditasi"];
    school = data.school;
    if (form?.error) {
      toasts.error(form.error);
    } else if (form?.success) {
      toasts.success(form.message || "Profil sekolah berhasil disimpan.");
    }
    head("jweaf5", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Profil Sekolah - Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"><div><h1 class="text-3xl font-bold text-slate-800 tracking-tight">Profil Sekolah</h1> <p class="text-slate-500 mt-1">Kelola identitas dan informasi resmi sekolah.</p></div></div> <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 shadow-xl shadow-indigo-500/20"><div class="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div> <div class="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-violet-400/20 blur-2xl pointer-events-none"></div> <div class="relative flex flex-col sm:flex-row items-center sm:items-end gap-5"><div class="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">`);
    if (logoUrl) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<img${attr("src", logoUrl)} alt="Logo Sekolah" class="w-full h-full object-contain p-1"/>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg class="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 13c0 5.523-4.477 10-10 10S2 18.523 2 13c0-.97.13-1.91.38-2.8L12 14z"></path></svg>`);
    }
    $$renderer2.push(`<!--]--></div> <div><p class="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Profil Institusi</p> <h2 class="text-2xl sm:text-3xl font-extrabold text-white leading-tight">${escape_html(school?.name || "Nama Sekolah")}</h2> `);
    if (school?.npsn) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-indigo-200 text-sm mt-1">NPSN: ${escape_html(school.npsn)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (school?.accreditation) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">Akreditasi ${escape_html(school.accreditation)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div></div> <form method="POST" action="?/update" class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-1 space-y-5"><div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"><h3 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center"><svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z"></path></svg></div> Logo Sekolah</h3> `);
    if (logoUrl) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="relative rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 flex flex-col items-center gap-3"><img${attr("src", logoUrl)} alt="Logo" class="max-h-36 object-contain rounded-lg"/> <button type="button" class="text-xs font-medium text-rose-600 hover:text-rose-800 flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg> Hapus Logo</button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="relative"><input type="file" accept="image/*" class="hidden"${attr("disabled", isUploading, true)}/> <button type="button"${attr_class(`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all ${"cursor-pointer"}`)}${attr("disabled", isUploading, true)}>`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3"><svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg></div> <span class="text-sm font-medium text-slate-700">Klik untuk unggah logo</span> <span class="text-xs text-slate-400 mt-1">PNG, JPG, SVG — Maks 5MB</span>`);
      }
      $$renderer2.push(`<!--]--></button> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <p class="text-xs text-slate-400 mt-3 text-center">Logo akan tampil di kartu login siswa</p></div></div> <div class="lg:col-span-2 space-y-5"><div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"><h3 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center"><svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div> Identitas Sekolah</h3> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div class="sm:col-span-2"><label for="name" class="block text-sm font-semibold text-slate-700 mb-1.5">Nama Sekolah <span class="text-rose-500">*</span></label> <input type="text" id="name" name="name" class="input" required="" placeholder="contoh: MAN 1 Kota..."${attr("value", school?.name || "")}/></div> <div><label for="npsn" class="block text-sm font-semibold text-slate-700 mb-1.5">NPSN</label> <input type="text" id="npsn" name="npsn" class="input" placeholder="8 digit NPSN"${attr("value", school?.npsn || "")}/></div> <div><label for="accreditation" class="block text-sm font-semibold text-slate-700 mb-1.5">Akreditasi</label> <select id="accreditation" name="accreditation" class="input">`);
    $$renderer2.option({ value: "" }, ($$renderer3) => {
      $$renderer3.push(`-- Pilih Akreditasi --`);
    });
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(ACCREDITATIONS);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let a = each_array[$$index];
      $$renderer2.option({ value: a, selected: school?.accreditation === a }, ($$renderer3) => {
        $$renderer3.push(`${escape_html(a)}`);
      });
    }
    $$renderer2.push(`<!--]--></select></div></div></div> <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"><h3 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center"><svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div> Kepala Sekolah &amp; Kontak</h3> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div class="sm:col-span-2"><label for="principal_name" class="block text-sm font-semibold text-slate-700 mb-1.5">Nama Kepala Sekolah</label> <input type="text" id="principal_name" name="principal_name" class="input" placeholder="Drs. H. ..."${attr("value", school?.principal_name || "")}/></div> <div class="sm:col-span-2"><label for="principal_nip" class="block text-sm font-semibold text-slate-700 mb-1.5">NIP <span class="text-slate-400 font-normal">(opsional)</span></label> <input type="text" id="principal_nip" name="principal_nip" class="input" placeholder="19xxxxxxxxxxxxxx"${attr("value", school?.principal_nip || "")}/></div> <div><label for="phone" class="block text-sm font-semibold text-slate-700 mb-1.5">Nomor Telepon</label> <input type="tel" id="phone" name="phone" class="input" placeholder="(0xxx) xxxxxxx"${attr("value", school?.phone || "")}/></div> <div><label for="email" class="block text-sm font-semibold text-slate-700 mb-1.5">Email Sekolah</label> <input type="email" id="email" name="email" class="input" placeholder="info@sekolah.sch.id"${attr("value", school?.email || "")}/></div> <div class="sm:col-span-2"><label for="website" class="block text-sm font-semibold text-slate-700 mb-1.5">Website Sekolah</label> <input type="url" id="website" name="website" class="input" placeholder="https://sekolah.sch.id"${attr("value", school?.website || "")}/></div></div></div> <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"><h3 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center"><svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div> Alamat Sekolah</h3> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div class="sm:col-span-2"><label for="address" class="block text-sm font-semibold text-slate-700 mb-1.5">Alamat Lengkap</label> <textarea id="address" name="address" rows="3" class="input resize-none" placeholder="Jl. Contoh No. 1, RT/RW ...">`);
    const $$body = escape_html(school?.address || "");
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <div><label for="province" class="block text-sm font-semibold text-slate-700 mb-1.5">Provinsi</label> <input type="text" id="province" name="province" class="input" placeholder="Jawa Timur"${attr("value", school?.province || "")}/></div> <div><label for="city" class="block text-sm font-semibold text-slate-700 mb-1.5">Kabupaten/Kota</label> <input type="text" id="city" name="city" class="input" placeholder="Kota Surabaya"${attr("value", school?.city || "")}/></div> <div><label for="district" class="block text-sm font-semibold text-slate-700 mb-1.5">Kecamatan</label> <input type="text" id="district" name="district" class="input" placeholder="Gubeng"${attr("value", school?.district || "")}/></div> <div><label for="village" class="block text-sm font-semibold text-slate-700 mb-1.5">Kelurahan/Desa</label> <input type="text" id="village" name="village" class="input" placeholder="Airlangga"${attr("value", school?.village || "")}/></div> <div><label for="postal_code" class="block text-sm font-semibold text-slate-700 mb-1.5">Kode POS</label> <input type="text" id="postal_code" name="postal_code" class="input" placeholder="60286"${attr("value", school?.postal_code || "")}/></div></div></div> <div class="flex justify-end"><button type="submit" class="btn btn-primary px-8"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> Simpan Profil Sekolah</button></div></div></form></div>`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
