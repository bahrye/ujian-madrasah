import { h as head, i as ensure_array_like, j as attr_class, l as clsx, e as escape_html, k as attr, f as bind_props } from "../../../../../chunks/index.js";
import { p as parseDate } from "../../../../../chunks/date.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let school, exam, participantsGrouped;
    let data = $$props["data"];
    school = data.school;
    exam = data.exam;
    participantsGrouped = data.participantsGrouped;
    data.isNomorPesertaMode;
    head("npx4lb", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Berita Acara - ${escape_html(exam.exam_type_name || exam.title)}</title>`);
      });
    });
    $$renderer2.push(`<div class="no-print p-4 bg-slate-800 text-white border-b border-slate-700 flex justify-between items-center sticky top-0 z-50 shadow-md svelte-npx4lb"><div class="text-xs text-slate-300">Gunakan kertas <strong>A4</strong> saat mencetak.</div> <div class="flex items-center gap-2"><button class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium transition-colors">Tutup</button> <button class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak Berita Acara</button></div></div> <div class="p-4 md:p-8 max-w-4xl mx-auto font-serif text-[15px] leading-snug print:p-0 print:m-0 bg-white"><!--[-->`);
    const each_array = ensure_array_like(Object.entries(participantsGrouped));
    for (let roomIdx = 0, $$length = each_array.length; roomIdx < $$length; roomIdx++) {
      let [roomName, sessionsDict] = each_array[roomIdx];
      $$renderer2.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(Object.entries(sessionsDict));
      for (let sessionIdx = 0, $$length2 = each_array_1.length; sessionIdx < $$length2; sessionIdx++) {
        let [sessionNumStr, count] = each_array_1[sessionIdx];
        const sessionNum = parseInt(sessionNumStr);
        const locationStr = [
          school?.district ? `Kecamatan ${school.district}` : "",
          school?.city ? school.city.toLowerCase().startsWith("kab") || school.city.toLowerCase().startsWith("kota") ? school.city : `Kabupaten ${school.city}` : "",
          school?.province ? school.province : ""
        ].filter(Boolean).join(", ");
        $$renderer2.push(`<div${attr_class(clsx(roomIdx > 0 || sessionIdx > 0 ? "break-before-page pt-8" : ""))}><div class="flex items-center justify-between gap-4 pb-3 mb-5 relative" style="border-bottom: 3px double #000;"><img src="/kemenag.png" alt="Logo Kemenag" class="w-20 h-20 object-contain shrink-0"/> <div class="flex-1 text-center font-serif px-2"><h4 class="font-semibold text-sm uppercase tracking-wider text-black m-0 leading-tight">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h4> <h3 class="font-bold text-xl uppercase tracking-wide text-black m-0 my-0.5">${escape_html(school?.name || "NAMA SEKOLAH")}</h3> `);
        if (school?.address) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="text-xs italic text-black m-0 leading-tight">${escape_html(school.address)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (locationStr) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="text-xs italic text-black m-0 leading-tight mt-0.5">${escape_html(locationStr)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> `);
        if (school?.logo_url) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<img${attr("src", school.logo_url)} alt="Logo Sekolah" class="w-20 h-20 object-contain shrink-0"/>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="w-20 h-20 shrink-0"></div>`);
        }
        $$renderer2.push(`<!--]--></div> <div class="text-center mb-6"><h1 class="font-bold text-lg uppercase underline tracking-wider mb-1">BERITA ACARA PELAKSANAAN UJIAN</h1> <p class="text-sm font-medium">Tahun Ajaran 2025/2026</p></div> <p class="mb-4 text-justify">Pada hari ini <span class="border-b border-dotted border-black px-2">${escape_html(exam.start_time ? parseDate(exam.start_time).toLocaleDateString("id-ID", { weekday: "long" }) : "................")}</span> tanggal <span class="border-b border-dotted border-black px-2">${escape_html(exam.start_time ? parseDate(exam.start_time).getDate() : "......")}</span> bulan <span class="border-b border-dotted border-black px-2">${escape_html(exam.start_time ? parseDate(exam.start_time).toLocaleDateString("id-ID", { month: "long" }) : "................")}</span> tahun <span class="border-b border-dotted border-black px-2">${escape_html(exam.start_time ? parseDate(exam.start_time).getFullYear() : "..........")}</span>, 
		telah diselenggarakan <strong class="uppercase">${escape_html(exam.exam_type_name || exam.title)}</strong> Mata Pelajaran <strong>${escape_html(exam.subject_name || "Umum")}</strong> untuk:</p> <div class="ml-4 mb-6"><table class="w-full"><tbody><tr class="align-top"><td class="w-48 py-1">a. Satuan Pendidikan</td><td class="w-4 py-1">:</td><td class="py-1 font-bold uppercase">${escape_html(school?.name || "-")}</td></tr><tr class="align-top"><td class="py-1">b. Ruang / Sesi Ujian</td><td class="py-1">:</td><td class="py-1 font-bold">${escape_html(roomName)} / Sesi ${escape_html(sessionNum)}</td></tr><tr class="align-top"><td class="py-1">c. Waktu Pelaksanaan</td><td class="py-1">:</td><td class="py-1">${escape_html(exam.start_time ? parseDate(exam.start_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "....")} s.d. ${escape_html(exam.end_time ? parseDate(exam.end_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "....")} WIB</td></tr><tr class="align-top"><td class="py-1">d. Jumlah Peserta Seharusnya</td><td class="py-1">:</td><td class="py-1">${escape_html(count)} Orang</td></tr><tr class="align-top"><td class="py-1">e. Jumlah Peserta Hadir</td><td class="py-1">:</td><td class="py-1">........... Orang</td></tr><tr class="align-top"><td class="py-1">f. Jumlah Peserta Tidak Hadir</td><td class="py-1">:</td><td class="py-1">........... Orang</td></tr><tr class="align-top"><td class="py-1 pl-4 text-sm font-sans" colspan="3">- Nomor Peserta yang Tidak Hadir: <span class="border-b border-dotted border-black px-4 inline-block min-w-[250px]"></span></td></tr></tbody></table></div> <div class="mb-6"><p class="mb-2 font-bold">Catatan / Kejadian Penting Selama Ujian Berlangsung:</p> <div class="border border-slate-400 p-3 min-h-[100px] text-xs font-mono text-slate-500 rounded">( Kosongkan jika pelaksanaan ujian berjalan tertib dan lancar )</div></div> <p class="mb-8">Demikian Berita Acara ini dibuat dengan sesungguhnya untuk dipergunakan sebagaimana mestinya.</p> <div class="grid grid-cols-2 gap-8 text-center mt-12"><div><p class="mb-16">Pengawas I</p> <p class="font-bold border-b border-black inline-block px-4">( .................................................... )</p> <p class="text-xs mt-1">NIP. ........................................</p></div> <div><p class="mb-16">Pengawas II</p> <p class="font-bold border-b border-black inline-block px-4">( .................................................... )</p> <p class="text-xs mt-1">NIP. ........................................</p></div></div></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
