import { m as fallback, k as attr, f as bind_props, e as escape_html, i as ensure_array_like } from "./index.js";
import "mammoth";
import { p as public_env } from "./shared-server.js";
import "./toast.js";
import { h as html } from "./html.js";
function ImportExcelModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let show = fallback($$props["show"], false);
    let parsedData = [];
    if (show) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true"><div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div> <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span> <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full"><div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><div class="sm:flex sm:items-start"><div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10"><svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div> <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full"><h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Import Soal dari Excel</h3> <div class="mt-4"><button type="button" class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"><svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Unduh Template Excel</button> <div class="mt-2 text-xs text-gray-600 p-2 bg-gray-50 rounded border border-gray-100"><p class="font-semibold mb-1">Panduan Pengisian:</p> <ul class="list-disc pl-4 space-y-1"><li>Gunakan <strong>Pilihan Ganda</strong>, <strong>Pilihan Ganda Kompleks</strong>, <strong>Benar Salah</strong>, <strong>Isian Singkat</strong>, atau <strong>Esai</strong> di kolom Tipe Soal.</li> <li>Jawaban Benar untuk Pilihan Ganda cukup diisi <strong>A/B/C/D/E</strong> (pisahkan dengan koma untuk Pilihan Ganda Kompleks, misal: <strong>A, C</strong>).</li> <li>Biarkan kolom opsi jawaban kosong untuk tipe selain pilihan ganda.</li></ul></div></div> <div class="mt-6 border-t border-gray-200 pt-4"><label class="block text-sm font-medium text-gray-700 mb-2">Pilih File Excel (.xlsx)</label> <input type="file" accept=".xlsx, .xls" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"/></div> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div></div> <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"><button type="button"${attr("disabled", true, true)} class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors">`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`Mulai Import`);
      }
      $$renderer2.push(`<!--]--></button> <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors">Batal</button></div> <form method="POST" action="?/importExcel" class="hidden"><input type="hidden" name="questions_json"${attr("value", JSON.stringify(parsedData))}/> <button type="submit" id="submit-import-btn"></button></form></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { show });
  });
}
function ImportWordModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let show = fallback($$props["show"], false);
    let parsedData = [];
    public_env.PUBLIC_CLOUDINARY_CLOUD_NAME || "dfhtjgwcz";
    public_env.PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ujian-madrasah";
    if (show) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"><div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50"><h3 class="font-bold text-slate-800 flex items-center gap-2"><svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> Import dari Word (.docx)</h3> <button type="button" class="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div> <div class="p-6 flex-1 overflow-y-auto"><div class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6"><h4 class="font-bold text-indigo-800 mb-2 flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Petunjuk Import</h4> <p class="text-sm text-indigo-700 mb-2">Pastikan file Word (.docx) Anda mengikuti format penulisan baku agar sistem dapat membacanya dengan tepat. Sistem otomatis mendukung tulisan tebal/miring, rumus (equation), hingga tabel dan gambar.</p> <div class="bg-white p-3 rounded-lg border border-indigo-100 text-sm text-slate-600 font-mono mb-3">1. Siapa penemu lampu?<br/> A. Thomas Alfa Edison<br/> B. Alexander Graham Bell<br/> C. Nikola Tesla<br/> D. Albert Einstein<br/> KUNCI: A<br/> <br/> 2. Apa ibukota Indonesia?<br/> A. Bandung<br/> B. Jakarta<br/> C. Surabaya<br/> D. Semarang<br/> KUNCI: B</div> <a href="/template_soal_ujian.docx" download="" class="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 shadow-sm transition-all hover:shadow"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Download Template Word</a></div> <div class="mb-6"><label class="block mb-2 font-medium text-slate-700">Pilih File (.docx)</label> <div class="flex items-center gap-3"><input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-slate-200 rounded-xl cursor-pointer"/> <button type="button" class="btn btn-primary whitespace-nowrap min-w-[120px] shadow-sm rounded-xl"${attr("disabled", true, true)}>`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`Baca File`);
      }
      $$renderer2.push(`<!--]--></button></div> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (parsedData.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div><div class="flex items-center justify-between mb-3"><h4 class="font-bold text-slate-800">Preview Data (${escape_html(parsedData.length)} Soal)</h4> <span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">Siap Diimport</span></div> <div class="overflow-hidden border border-slate-200 rounded-xl shadow-sm"><div class="max-h-[300px] overflow-y-auto bg-slate-50"><table class="w-full text-left text-sm"><thead class="bg-white border-b border-slate-200 sticky top-0 shadow-sm z-10"><tr><th class="p-3 font-semibold text-slate-600 w-16 text-center">No</th><th class="p-3 font-semibold text-slate-600">Soal &amp; Opsi</th><th class="p-3 font-semibold text-slate-600 w-24 text-center">Kunci</th></tr></thead><tbody class="divide-y divide-slate-200"><!--[-->`);
        const each_array = ensure_array_like(parsedData);
        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
          let row = each_array[i];
          $$renderer2.push(`<tr class="hover:bg-white transition-colors"><td class="p-3 text-center text-slate-500 font-medium align-top">${escape_html(i + 1)}</td><td class="p-3 align-top"><div class="text-slate-800 font-medium mb-2 prose prose-sm max-w-none">${html(row.question_text)}</div> <div class="text-xs text-slate-500 space-y-1"><!--[-->`);
          const each_array_1 = ensure_array_like(row.options);
          for (let optIdx = 0, $$length2 = each_array_1.length; optIdx < $$length2; optIdx++) {
            let opt = each_array_1[optIdx];
            $$renderer2.push(`<div class="flex gap-1.5"><span class="font-bold">${escape_html(String.fromCharCode(65 + optIdx))}.</span> <div class="prose prose-sm max-w-none">${html(opt)}</div></div>`);
          }
          $$renderer2.push(`<!--]--></div></td><td class="p-3 text-center align-top"><span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold border border-emerald-200">${escape_html(row.correct_answer)}</span></td></tr>`);
        }
        $$renderer2.push(`<!--]--></tbody></table></div></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 rounded-b-2xl"><button type="button" class="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">Batal</button> <button type="button" class="btn btn-primary rounded-xl px-6 py-2.5 shadow-sm flex items-center gap-2"${attr("disabled", parsedData.length === 0, true)}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> Import ${escape_html(parsedData.length > 0 ? `${parsedData.length} Soal` : "")}</button></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { show });
  });
}
export {
  ImportExcelModal as I,
  ImportWordModal as a
};
