import { h as head, j as attr_class, i as ensure_array_like, k as attr, e as escape_html, c as stringify, f as bind_props } from "../../../../../../chunks/index.js";
import { a as getQrCodeImageUrl, g as generateStudentQrData } from "../../../../../../chunks/qrLogin.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let school, examType, participants;
    let data = $$props["data"];
    school = data.school;
    examType = data.examType;
    participants = data.participants;
    head("gnnven", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Cetak Kartu Peserta Ujian - ${escape_html(examType.name)}</title>`);
      });
    });
    $$renderer2.push(`<div class="no-print p-4 bg-slate-800 text-white border-b border-slate-700 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-md"><div class="flex items-center gap-3 flex-wrap"><span class="text-xs font-semibold uppercase tracking-wider text-slate-300">Pilih Desain:</span> <button${attr_class(`px-3 py-1.5 rounded text-xs font-semibold transition-all ${"bg-indigo-600 text-white shadow"}`)}>Desain 1 (Default)</button> <button${attr_class(`px-3 py-1.5 rounded text-xs font-semibold transition-all ${"bg-slate-700 text-slate-300 hover:bg-slate-600"}`)}>Desain 2 (Kartu Login)</button></div> <div class="flex items-center gap-2"><button class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium transition-colors">Tutup</button> <button class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak Kartu</button></div></div> <div class="p-4 sm:p-8 print:p-0 overflow-x-auto print:overflow-visible w-full">`);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="print:w-full min-w-[750px] print:min-w-0"><!--[-->`);
      const each_array = ensure_array_like(Array(Math.ceil(participants.length / 4)));
      for (let pageIndex = 0, $$length = each_array.length; pageIndex < $$length; pageIndex++) {
        each_array[pageIndex];
        $$renderer2.push(`<div class="grid grid-cols-2 grid-rows-2 gap-6 print:h-[275mm] break-after-page mb-6 print:mb-0"><!--[-->`);
        const each_array_1 = ensure_array_like(participants.slice(pageIndex * 4, pageIndex * 4 + 4));
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let p = each_array_1[$$index];
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
          $$renderer2.push(`<!--]--></div> <img${attr("src", getQrCodeImageUrl(generateStudentQrData(p.login_username || p.username, p.login_password || p.nisn)))} alt="QR Login" class="w-14 h-14 object-contain mix-blend-multiply" title="Scan QR untuk Login Siswa"/></div> <div class="p-4 flex-1 flex flex-col"><div class="text-center font-bold text-xs mb-3 pb-2 border-b border-slate-300">${escape_html(examType.name || "Ujian")}</div> <table class="w-full text-[11px] leading-snug"><tbody><tr><td class="py-1 w-28 align-top font-medium text-slate-700">No. Peserta</td><td class="py-1 w-4 align-top text-center">:</td><td class="py-1 font-bold align-top">${escape_html(p.display_nomor_peserta)}</td></tr><tr><td class="py-1 align-top font-medium text-slate-700">NISN</td><td class="py-1 align-top text-center">:</td><td class="py-1 align-top font-bold">${escape_html(p.display_nisn)}</td></tr><tr><td class="py-1 align-top font-medium text-slate-700">Nama</td><td class="py-1 align-top text-center">:</td><td class="py-1 align-top font-bold"><div class="line-clamp-2 leading-tight pr-1">${escape_html(p.student_name)}</div></td></tr><tr><td class="py-1 align-top font-medium text-slate-700">Kelas</td><td class="py-1 align-top text-center">:</td><td class="py-1 align-top font-bold">${escape_html(p.class_name || "-")}</td></tr><tr><td class="py-1 align-top font-medium text-slate-700">TTL</td><td class="py-1 align-top text-center">:</td><td class="py-1 align-top font-bold">${escape_html(p.place_of_birth || "-")}, ${escape_html(p.date_of_birth ? new Date(p.date_of_birth).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-")}</td></tr><tr><td class="py-1 align-top font-medium text-slate-700">Link Akses</td><td class="py-1 align-top text-center">:</td><td class="py-1 align-top font-bold">https://ujian-madrasah.pages.dev</td></tr></tbody></table> <div class="flex-1 min-h-[0.5rem]"></div> <div class="mt-3 text-[11px] bg-slate-50 border border-slate-200 p-1.5 rounded text-slate-700 text-center font-medium">Gunakan <span class="font-bold">No. Peserta</span> sebagai Username dan <span class="font-bold">NISN</span> sebagai Password.</div> <div class="mt-4 flex justify-between items-end"><div class="flex gap-3 items-end">`);
          if (p.photo) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<img${attr("src", p.photo)}${attr("alt", `Foto ${stringify(p.student_name)}`)} class="w-[2cm] h-[3cm] border-2 border-slate-300 object-cover bg-slate-50"/>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<div class="w-[2cm] h-[3cm] border-2 border-slate-300 flex items-center justify-center bg-slate-50 text-slate-400 text-[10px] text-center p-1">Pas Foto<br/>2 x 3</div>`);
          }
          $$renderer2.push(`<!--]--></div> <div class="text-center mt-3"><p class="text-[10px] mb-6">Panitia Ujian</p> <p class="text-[10px] font-bold border-b border-slate-800 inline-block px-2">${escape_html(data.committeeName || "......................................")}</p></div></div></div></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (participants.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="text-center text-slate-500 py-10">Belum ada data siswa.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
