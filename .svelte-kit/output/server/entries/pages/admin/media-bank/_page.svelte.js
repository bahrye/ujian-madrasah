import { f as bind_props, h as head, e as escape_html, i as ensure_array_like, j as attr_class, k as attr, c as stringify } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let form = $$props["form"];
    let isDeleting = false;
    let successMsg = "";
    let errorMsg = "";
    {
      if (form?.success) {
        successMsg = form.success;
        setTimeout(() => successMsg = "", 4e3);
      }
      if (form?.error) {
        errorMsg = form.error;
        setTimeout(() => errorMsg = "", 6e3);
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1yxe13y", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Bank Media - Ujian Madrasah</title>`);
        });
      });
      $$renderer3.push(`<div class="max-w-6xl mx-auto"><div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"><div><h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2"><svg class="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg> Bank Media (Cloudinary)</h1> <p class="text-slate-500 mt-1">Kelola semua file gambar dan audio yang telah diunggah ke Cloudinary dan terhubung dengan soal ujian.</p></div> <button class="btn btn-primary whitespace-nowrap shadow-sm"><svg class="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> Unggah Media Baru</button></div> `);
      if (errorMsg) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="alert alert-danger mb-6 transition-opacity duration-300"><svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> <span>${escape_html(errorMsg)}</span></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (successMsg) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="alert alert-success mb-6 transition-opacity duration-300"><svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <span>${escape_html(successMsg)}</span></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (data.mediaItems.length === 0) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="card p-12 text-center"><div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg></div> <h3 class="text-lg font-medium text-slate-900">Bank Media Kosong</h3> <p class="text-slate-500 mt-1">Belum ada file media Cloudinary yang terhubung dengan soal ujian.</p></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"><!--[-->`);
        const each_array = ensure_array_like(data.mediaItems);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let item = each_array[$$index];
          $$renderer3.push(`<div${attr_class(`card overflow-hidden flex flex-col ${item.question_id ? "" : "border-amber-400 ring-2 ring-amber-400/20"}`)}><div${attr_class(`h-40 ${item.question_id ? "bg-slate-100" : "bg-amber-50"} relative flex items-center justify-center border-b ${item.question_id ? "border-slate-100" : "border-amber-200"} cursor-pointer group`)}>`);
          if (item.media_type === "image") {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<img${attr("src", item.media_url)}${attr("alt", `Media Soal ${stringify(item.question_number)}`)} class="w-full h-full object-contain p-2 transition-transform group-hover:scale-105" loading="lazy"/>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<div class="text-center p-4 transition-transform group-hover:scale-110"><svg class="w-12 h-12 text-indigo-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg> <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">File Audio</span></div>`);
          }
          $$renderer3.push(`<!--]--> <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-0"></div> <div class="absolute top-2 left-2 flex flex-col gap-1 items-start z-10"><span class="badge badge-primary shadow-sm">${escape_html(item.media_type)}</span></div> <div class="absolute top-2 right-2 z-10"><form method="POST" action="?/toggleVisibility"><input type="hidden" name="media_url"${attr("value", item.media_url)}/> <input type="hidden" name="is_public"${attr("value", item.is_public ? "0" : "1")}/> <button type="submit"${attr_class(`group relative px-2.5 py-1 rounded-full border shadow-sm transition-all flex items-center gap-1.5 ${item.is_public ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`)}><span${attr_class(`w-2 h-2 rounded-full ${item.is_public ? "bg-emerald-500" : "bg-slate-400"} transition-colors`)}></span> <span class="text-[10px] font-semibold tracking-wide">${escape_html(item.is_public ? "PUBLIK" : "PRIVAT")}</span> <div class="absolute inset-0 bg-white/0 group-hover:bg-black/5 rounded-full transition-colors"></div></button></form></div></div> <div${attr_class(`p-4 flex-1 flex flex-col ${item.question_id ? "" : "bg-amber-50/50"}`)}><form method="POST" action="?/updateName" class="mb-4"><input type="hidden" name="media_url"${attr("value", item.media_url)}/> <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Nama File</p> <div class="flex gap-2"><input type="text" name="name"${attr("value", item.name || "")} placeholder="Belum ada nama" class="input py-1.5 px-2.5 text-sm flex-1 h-8"/> <button type="submit" class="btn btn-primary py-1.5 px-3 text-xs h-8">Simpan</button></div></form> <div class="flex-1 space-y-2 mb-4">`);
          if (item.question_id) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div><p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Mata Pelajaran</p> <p class="text-sm font-medium text-slate-700 line-clamp-1">${escape_html(item.subject_name || "Tidak ada")}</p></div> <div><p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Ujian &amp; Posisi</p> <p class="text-sm text-slate-600 line-clamp-2"><span class="font-medium">${escape_html(item.exam_title)}</span> <br/> <span class="text-indigo-600 font-medium">Soal Nomor ${escape_html(item.question_number)}</span></p></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<div class="h-full flex flex-col items-center justify-center text-center space-y-2"><div class="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div> <div><p class="text-sm font-bold text-amber-600">Yatim Piatu</p> <p class="text-xs text-amber-700/70 mt-1">File tidak digunakan di soal manapun</p></div></div>`);
          }
          $$renderer3.push(`<!--]--></div> <div class="mt-3 mb-3 text-[11px] text-slate-500 bg-white p-2 rounded-lg flex justify-between items-center border border-slate-200 shadow-sm"><span class="flex items-center gap-1"><svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> Pengunggah:</span> <span class="font-bold text-slate-700">${escape_html(item.uploader_name || "Sistem")}</span></div> <div${attr_class(`pt-3 border-t ${item.question_id ? "border-slate-100" : "border-amber-200"}`)}><button type="button"${attr_class(`btn ${item.question_id ? "btn-danger" : "bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg"} w-full py-2 flex items-center justify-center gap-2`)}${attr("disabled", isDeleting, true)}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> ${escape_html(item.question_id ? "Hapus File Permanen" : "Bersihkan File Ini")}</button></div></div></div>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      }
      $$renderer3.push(`<!--]--></div> `);
      {
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
