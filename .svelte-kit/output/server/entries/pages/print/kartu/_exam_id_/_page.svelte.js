import { h as head, i as ensure_array_like, k as attr, e as escape_html, f as bind_props } from "../../../../../chunks/index.js";
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
    $$renderer2.push(`<div class="p-8"><div class="grid grid-cols-2 gap-6"><!--[-->`);
    const each_array = ensure_array_like(participants);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let p = each_array[$$index];
      $$renderer2.push(`<div class="border-2 border-slate-800 p-0 rounded-lg overflow-hidden break-inside-avoid shadow-sm h-[8.5cm] flex flex-col"><div class="flex items-center gap-4 p-3 border-b-2 border-slate-800 bg-slate-100">`);
      if (school?.logo_url) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<img${attr("src", school.logo_url)} alt="Logo" class="w-14 h-14 object-contain"/>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="w-14 h-14 bg-white border border-slate-300 rounded flex items-center justify-center text-[10px] text-center p-1 text-slate-500 font-bold">LOGO</div>`);
      }
      $$renderer2.push(`<!--]--> <div class="flex-1 text-center"><h2 class="font-bold text-sm tracking-wide uppercase">KARTU PESERTA UJIAN</h2> <h3 class="font-bold text-sm uppercase">${escape_html(school?.name || "NAMA SEKOLAH")}</h3> `);
      if (school?.address) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="text-[10px] text-slate-700 leading-tight mt-1">${escape_html(school.address)}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="w-14 h-14"></div></div> <div class="p-4 flex-1 flex flex-col justify-between"><div><div class="text-center font-bold text-sm mb-4 pb-2 border-b border-slate-300">${escape_html(exam.exam_type_name || "Ujian")} - ${escape_html(exam.subject_name || "Umum")}</div> <table class="w-full text-sm"><tbody><tr><td class="py-1 w-24 font-medium text-slate-700">No. Peserta</td><td class="py-1 w-4 text-center">:</td><td class="py-1 font-bold">${escape_html(p.nisn)}</td></tr><tr><td class="py-1 font-medium text-slate-700">Nama</td><td class="py-1 text-center">:</td><td class="py-1 font-bold">${escape_html(p.student_name)}</td></tr><tr><td class="py-1 font-medium text-slate-700">Kelas / Ruang</td><td class="py-1 text-center">:</td><td class="py-1 font-bold">${escape_html(p.class_name || "-")} / ..........</td></tr><tr><td class="py-1 font-medium text-slate-700">TTL</td><td class="py-1 text-center">:</td><td class="py-1 font-bold">${escape_html(p.place_of_birth || "-")}, ${escape_html(p.date_of_birth ? new Date(p.date_of_birth).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-")}</td></tr><tr><td class="py-1 font-medium text-slate-700">Link Akses</td><td class="py-1 text-center">:</td><td class="py-1 font-bold">https://ujian-madrasah.pages.dev</td></tr></tbody></table> <div class="mt-3 text-[11px] bg-slate-50 border border-slate-200 p-1.5 rounded text-slate-700 text-center font-medium">Gunakan <span class="font-bold">No. Peserta</span> sebagai Username dan <span class="font-bold">NISN</span> sebagai Password.</div></div> <div class="mt-4 flex justify-between items-end"><div class="w-[3cm] h-[4cm] border-2 border-slate-300 flex items-center justify-center bg-slate-50 text-slate-400 text-xs text-center p-2">Pas Foto<br/>3 x 4</div> <div class="text-center"><p class="text-xs mb-10">Panitia Ujian</p> <p class="text-xs font-bold border-b border-slate-800 inline-block px-4">......................................</p></div></div></div></div>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (participants.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="text-center text-slate-500 py-10">Belum ada peserta di ujian ini.</div>`);
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
