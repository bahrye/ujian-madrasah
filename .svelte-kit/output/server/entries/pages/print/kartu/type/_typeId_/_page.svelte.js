import { h as head, j as attr_class, i as ensure_array_like, k as attr, e as escape_html, c as stringify, f as bind_props } from "../../../../../../chunks/index.js";
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
    $$renderer2.push(`<div class="print:hidden p-4 bg-white border-b border-slate-200 flex items-center gap-4 sticky top-0 z-10 shadow-sm"><span class="text-sm font-medium text-slate-700">Pilih Desain:</span> <button${attr_class(`px-4 py-2 rounded-lg text-sm font-medium transition-all ${"bg-blue-600 text-white shadow-md"}`)}>Desain 1 (Default)</button> <button${attr_class(`px-4 py-2 rounded-lg text-sm font-medium transition-all ${"bg-slate-100 text-slate-600 hover:bg-slate-200"}`)}>Desain 2 (Kartu Login)</button> <button class="ml-auto px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all shadow-sm">🖨️ Cetak</button></div> <div class="p-8">`);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="grid grid-cols-2 gap-6"><!--[-->`);
      const each_array = ensure_array_like(participants);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let p = each_array[$$index];
        $$renderer2.push(`<div class="border-2 border-slate-800 p-0 rounded-lg overflow-hidden break-inside-avoid shadow-sm h-auto min-h-[11cm] flex flex-col"><div class="flex items-center gap-4 p-3 border-b-2 border-slate-800 bg-slate-100">`);
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
        $$renderer2.push(`<!--]--></div> <div class="w-14 h-14"></div></div> <div class="p-4 flex-1 flex flex-col justify-between"><div><div class="text-center font-bold text-sm mb-4 pb-2 border-b border-slate-300">${escape_html(examType.name || "Ujian")}</div> <table class="w-full text-sm"><tbody><tr><td class="py-1 w-28 align-top font-medium text-slate-700">No. Peserta</td><td class="py-1 w-4 align-top text-center">:</td><td class="py-1 font-bold align-top">${escape_html(p.display_nomor_peserta)}</td></tr><tr><td class="py-1 align-top font-medium text-slate-700">NISN</td><td class="py-1 align-top text-center">:</td><td class="py-1 align-top font-bold">${escape_html(p.display_nisn)}</td></tr><tr><td class="py-1 align-top font-medium text-slate-700">Nama</td><td class="py-1 align-top text-center">:</td><td class="py-1 align-top font-bold">${escape_html(p.student_name)}</td></tr><tr><td class="py-1 align-top font-medium text-slate-700">Kelas / Ruang</td><td class="py-1 align-top text-center">:</td><td class="py-1 align-top font-bold">${escape_html(p.class_name || "-")} / ..........</td></tr><tr><td class="py-1 align-top font-medium text-slate-700">Username</td><td class="py-1 align-top text-center">:</td><td class="py-1 align-top font-mono font-bold tracking-wider">${escape_html(p.login_username)}</td></tr><tr><td class="py-1 align-top font-medium text-slate-700">Password</td><td class="py-1 align-top text-center">:</td><td class="py-1 align-top font-mono font-bold tracking-wider">${escape_html(p.login_password)}</td></tr></tbody></table></div> <div class="mt-4 flex justify-between items-end">`);
        if (p.photo) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<img${attr("src", p.photo)}${attr("alt", `Foto ${stringify(p.student_name)}`)} class="w-[3cm] h-[4cm] border-2 border-slate-300 object-cover bg-slate-50"/>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="w-[3cm] h-[4cm] border-2 border-slate-300 flex items-center justify-center bg-slate-50 text-slate-400 text-xs text-center p-2">Pas Foto<br/>3 x 4</div>`);
        }
        $$renderer2.push(`<!--]--> <div class="text-center"><p class="text-xs mb-10">Panitia Ujian</p> <p class="text-xs font-bold border-b border-slate-800 inline-block px-4">......................................</p></div></div></div></div>`);
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
