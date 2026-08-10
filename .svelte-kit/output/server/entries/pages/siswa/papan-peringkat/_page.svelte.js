import { h as head, i as ensure_array_like, e as escape_html, k as attr, c as stringify, f as bind_props } from "../../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    head("uya8ih", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Papan Peringkat - Siswa</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="mb-8"><h1 class="text-3xl font-bold text-slate-800 tracking-tight">Papan Peringkat</h1> <p class="text-slate-500 mt-1">Lihat peringkatmu dibandingkan dengan teman sekelas.</p></div> <section><h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg> Kategori Papan Peringkat</h2> `);
    if (data.examTypes.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 shadow-sm"><p>Belum ada tipe ujian yang tersedia.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"><!--[-->`);
      const each_array = ensure_array_like(data.examTypes);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let type = each_array[$$index];
        $$renderer2.push(`<div class="bg-gradient-to-br from-indigo-500 to-primary-600 rounded-2xl p-6 shadow-md text-white flex flex-col hover:shadow-lg transition-shadow"><div class="mb-6"><div class="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></div> <h3 class="font-bold text-xl leading-tight">${escape_html(type.type_name)}</h3> <p class="text-white/80 text-sm mt-1">Pilih jenis peringkat yang ingin dilihat untuk kategori ini.</p></div> <div class="mt-auto space-y-3"><a${attr("href", `/siswa/papan-peringkat/type/${stringify(type.id)}`)} class="bg-white text-primary-600 hover:bg-slate-50 font-semibold px-4 py-2.5 rounded-xl w-full text-center inline-block transition-colors shadow-sm text-sm">Peringkat Akumulasi</a> <a${attr("href", `/siswa/papan-peringkat/type/${stringify(type.id)}/exams`)} class="bg-white/20 text-white hover:bg-white/30 border border-white/30 font-semibold px-4 py-2.5 rounded-xl w-full text-center inline-block transition-colors text-sm">Peringkat Per Ujian</a></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></section></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
