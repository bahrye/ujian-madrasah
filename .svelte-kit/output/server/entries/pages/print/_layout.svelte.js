import { h as head, d as slot } from "../../../chunks/index.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    head("7tad9h", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<style>
		@page {
			margin: 1cm;
			size: A4;
		}
		@media print {
			html, body {
				height: initial !important;
				overflow: initial !important;
				-webkit-print-color-adjust: exact;
				print-color-adjust: exact;
			}
			/* Hide everything that is not meant for printing */
			.no-print {
				display: none !important;
			}
		}
		
		body {
			background-color: white !important;
			color: black !important;
		}
	</style>`);
    });
    $$renderer2.push(`<div class="bg-white min-h-screen text-slate-900 print:bg-white print:text-black"><div class="no-print p-4 bg-white border-b border-slate-200 flex flex-wrap justify-end gap-2 shadow-sm relative z-50"><button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow font-medium flex items-center gap-2 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak Dokumen</button> <button class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg shadow font-medium transition-colors">Tutup</button></div> <div class="max-w-[21cm] mx-auto print:max-w-none print:mx-0 print:w-full"><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _layout as default
};
