import { m as fallback, k as attr, f as bind_props } from "./index.js";
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
export {
  ImportExcelModal as I
};
