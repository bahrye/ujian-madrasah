import { h as head, i as ensure_array_like, k as attr, e as escape_html, f as bind_props } from "../../../../../chunks/index.js";
import { p as parseProctors } from "../../../../../chunks/format.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let school, exam, participants;
    let data = $$props["data"];
    school = data.school;
    exam = data.exam;
    participants = data.participants;
    head("1w0banc", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Cetak Kartu Peserta Ujian - ${escape_html(exam.title)}</title>`);
      });
    });
    $$renderer2.push(`<div class="no-print p-4 bg-slate-800 text-white border-b border-slate-700 flex justify-between items-center sticky top-0 z-50 shadow-md"><div class="text-xs text-slate-300">Gunakan kertas <strong>A4</strong> saat mencetak.</div> <div class="flex items-center gap-2"><button class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium transition-colors">Tutup</button> <button class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak Kartu</button></div></div> <div class="p-4 sm:p-8 print:p-0 overflow-x-auto print:overflow-visible w-full"><div class="print:w-full min-w-[750px] print:min-w-0"><!--[-->`);
    const each_array = ensure_array_like(Array(Math.ceil(participants.length / 4)));
    for (let pageIndex = 0, $$length = each_array.length; pageIndex < $$length; pageIndex++) {
      each_array[pageIndex];
      $$renderer2.push(`<div class="grid grid-cols-2 grid-rows-2 gap-6 print:h-[275mm] break-after-page mb-6 print:mb-0"><!--[-->`);
      const each_array_1 = ensure_array_like(participants.slice(pageIndex * 4, pageIndex * 4 + 4));
      for (let $$index_1 = 0, $$length2 = each_array_1.length; $$index_1 < $$length2; $$index_1++) {
        let p = each_array_1[$$index_1];
        $$renderer2.push(`<div class="border-2 border-slate-800 p-0 rounded-lg overflow-hidden break-inside-avoid shadow-sm h-full flex flex-col"><div class="flex items-center gap-4 p-3 border-b-2 border-slate-800 bg-slate-100">`);
        if (school?.logo_url) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<img${attr("src", school.logo_url)} alt="Logo" class="w-14 h-14 object-contain"/>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="w-14 h-14 bg-white border border-slate-300 rounded flex items-center justify-center text-[10px] text-center p-1 text-slate-500 font-bold">LOGO</div>`);
        }
        $$renderer2.push(`<!--]--> <div class="flex-1 text-center"><h2 class="font-bold text-xs tracking-wide uppercase">KARTU PESERTA UJIAN</h2> <h3 class="font-bold text-xs uppercase">${escape_html(school?.name || "NAMA SEKOLAH")}</h3> `);
        if (school?.address) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="text-[9px] text-slate-700 leading-tight mt-0.5">${escape_html(school.address)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&amp;data=https://ujian-madrasah.pages.dev" alt="QR Code" class="w-14 h-14 object-contain mix-blend-multiply" title="Scan untuk akses"/></div> <div class="p-4 flex-1 flex flex-col"><div class="text-center font-bold text-xs mb-3 pb-2 border-b border-slate-300 leading-snug break-words">${escape_html(exam.title)}</div> <div class="flex-1 flex gap-4"><div class="w-24 flex flex-col items-center gap-2"><div class="w-20 h-24 bg-slate-200 border border-slate-400 flex items-center justify-center text-[10px] text-slate-400 font-semibold text-center leading-tight p-1">FOTO 3x4</div> <div class="text-[10px] font-mono font-bold bg-slate-100 px-1 py-0.5 border border-slate-300 rounded text-center w-full truncate"${attr("title", p.username)}>${escape_html(p.username)}</div></div> <div class="flex-1 text-xs space-y-1.5"><div class="grid grid-cols-[80px_8px_1fr] items-baseline"><span class="text-slate-600">Nama</span> <span>:</span> <span class="font-bold uppercase truncate">${escape_html(p.student_name)}</span></div> <div class="grid grid-cols-[80px_8px_1fr] items-baseline"><span class="text-slate-600">No. Peserta</span> <span>:</span> <span class="font-mono font-bold">${escape_html(p.nomor_peserta || "-")}</span></div> <div class="grid grid-cols-[80px_8px_1fr] items-baseline"><span class="text-slate-600">NISN</span> <span>:</span> <span class="font-mono">${escape_html(p.nisn || "-")}</span></div> <div class="grid grid-cols-[80px_8px_1fr] items-baseline"><span class="text-slate-600">Kelas</span> <span>:</span> <span class="font-bold">${escape_html(p.class_name || "-")}</span></div> <div class="grid grid-cols-[80px_8px_1fr] items-baseline"><span class="text-slate-600">Ruang / Sesi</span> <span>:</span> <span class="font-semibold">${escape_html(p.room_name || "-")} / Sesi ${escape_html(p.session_number || 1)}</span></div> <!--[-->`);
        const each_array_2 = ensure_array_like(parseProctors(exam.proctors));
        for (let $$index = 0, $$length3 = each_array_2.length; $$index < $$length3; $$index++) {
          let pr = each_array_2[$$index];
          $$renderer2.push(`<div class="grid grid-cols-[80px_8px_1fr] items-baseline"><span class="text-slate-600">${escape_html(pr.label)}</span> <span>:</span> <span class="font-semibold truncate">${escape_html(pr.name)}</span></div>`);
        }
        $$renderer2.push(`<!--]--> <div class="grid grid-cols-[80px_8px_1fr] items-baseline"><span class="text-slate-600">Password</span> <span>:</span> <span class="font-mono bg-slate-100 px-1 border border-slate-200 rounded">${escape_html(p.plain_password || "******")}</span></div></div></div> <div class="mt-2 pt-2 border-t border-slate-200 flex justify-between items-end text-[9px] text-slate-500"><div>Simpan kartu ini dengan baik selama ujian.</div> <div class="font-semibold text-slate-700 text-right"><p class="text-[9px] mb-5">Panitia Ujian,</p> <p class="text-[9px] font-bold border-b border-slate-800 inline-block px-2">${escape_html(data.committeeName || "......................................")}</p></div></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
