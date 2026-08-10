import { h as head, i as ensure_array_like, j as attr_class, l as clsx, k as attr, e as escape_html, f as bind_props } from "../../../../../chunks/index.js";
import { p as parseDate } from "../../../../../chunks/date.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let school, exam, participantsByClass, isNomorPesertaMode;
    let data = $$props["data"];
    school = data.school;
    exam = data.exam;
    participantsByClass = data.participantsByClass;
    isNomorPesertaMode = data.isNomorPesertaMode;
    head("5lujtk", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Daftar Hadir Ujian - ${escape_html(exam.title)}</title>`);
      });
    });
    $$renderer2.push(`<div class="p-8"><!--[-->`);
    const each_array = ensure_array_like(Object.entries(participantsByClass));
    for (let classIdx = 0, $$length = each_array.length; classIdx < $$length; classIdx++) {
      let [className, students] = each_array[classIdx];
      $$renderer2.push(`<div${attr_class(clsx(classIdx > 0 ? "break-before-page pt-8" : ""))}><div class="text-center mb-6 pb-4 border-b-2 border-black flex items-center">`);
      if (school?.logo_url) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<img${attr("src", school.logo_url)} alt="Logo" class="w-20 h-20 object-contain absolute"/>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex-1"><h2 class="font-bold text-lg uppercase tracking-wide">DAFTAR HADIR PESERTA UJIAN</h2> <h3 class="font-bold text-xl uppercase">${escape_html(school?.name || "NAMA SEKOLAH")}</h3> `);
      if (school?.address) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="text-sm mt-1">${escape_html(school.address)}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div> <div class="grid grid-cols-2 gap-4 mb-4 text-sm"><table class="w-full"><tbody><tr><td class="py-1 w-32 font-medium">Ujian</td><td class="w-4">:</td><td>${escape_html(exam.title)}</td></tr><tr><td class="py-1 font-medium">Mata Pelajaran</td><td>:</td><td>${escape_html(exam.subject_name || "Umum")}</td></tr><tr><td class="py-1 font-medium">Kelas / Ruang</td><td>:</td><td>${escape_html(className)} / ....................</td></tr></tbody></table> <table class="w-full"><tbody><tr><td class="py-1 w-32 font-medium">Hari, Tanggal</td><td class="w-4">:</td><td>${escape_html(exam.start_time ? parseDate(exam.start_time).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }) : "......................")}</td></tr><tr><td class="py-1 font-medium">Waktu</td><td>:</td><td>${escape_html(exam.start_time ? parseDate(exam.start_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "....")} - ${escape_html(exam.end_time ? parseDate(exam.end_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "....")}</td></tr></tbody></table></div> <table class="w-full border-collapse border border-black mb-8 text-sm"><thead><tr><th class="border border-black p-2 w-12 text-center">No</th><th class="border border-black p-2 w-32">${escape_html(isNomorPesertaMode ? "No. Peserta" : "NISN")}</th><th class="border border-black p-2 text-left">Nama Peserta</th><th class="border border-black p-2 w-48 text-center" colspan="2">Tanda Tangan</th><th class="border border-black p-2 w-24 text-center">Ket.</th></tr></thead><tbody><!--[-->`);
      const each_array_1 = ensure_array_like(students);
      for (let i = 0, $$length2 = each_array_1.length; i < $$length2; i++) {
        let p = each_array_1[i];
        $$renderer2.push(`<tr><td class="border border-black p-2 text-center">${escape_html(i + 1)}</td><td class="border border-black p-2 text-center font-mono">${escape_html(isNomorPesertaMode ? p.nomor_peserta || "-" : p.nisn || p.username)}</td><td class="border border-black p-2">${escape_html(p.student_name)}</td><td class="border-b border-black p-2 w-24 align-top h-12">`);
        if ((i + 1) % 2 !== 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-xs text-slate-500">${escape_html(i + 1)}.</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></td><td class="border-b border-r border-black p-2 w-24 align-top h-12">`);
        if ((i + 1) % 2 === 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-xs text-slate-500">${escape_html(i + 1)}.</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></td><td class="border border-black p-2 text-center"></td></tr>`);
      }
      $$renderer2.push(`<!--]-->`);
      if (students.length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<tr><td colspan="6" class="border border-black p-4 text-center italic">Tidak ada peserta di kelas ini.</td></tr>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></tbody></table> <div class="flex justify-between mt-8 text-sm px-10"><div class="text-center"><p class="mb-20">Pengawas Ruang</p> <p class="font-bold border-b border-black inline-block px-4">........................................</p> <p class="mt-1">NIP. ........................................</p></div> <div class="text-center"><p class="mb-20">Proktor / Teknisi</p> <p class="font-bold border-b border-black inline-block px-4">........................................</p> <p class="mt-1">NIP. ........................................</p></div></div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (Object.keys(participantsByClass).length === 0) {
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
