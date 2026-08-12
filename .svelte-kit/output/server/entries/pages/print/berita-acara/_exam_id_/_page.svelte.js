import { h as head, i as ensure_array_like, j as attr_class, l as clsx, k as attr, e as escape_html, f as bind_props } from "../../../../../chunks/index.js";
import { p as parseDate } from "../../../../../chunks/date.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let school, exam, participantsGrouped, isNomorPesertaMode;
    let data = $$props["data"];
    school = data.school;
    exam = data.exam;
    participantsGrouped = data.participantsGrouped;
    isNomorPesertaMode = data.isNomorPesertaMode;
    head("npx4lb", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Berita Acara - ${escape_html(exam.exam_type_name || exam.title)}</title>`);
      });
    });
    $$renderer2.push(`<div class="p-4 md:p-8 max-w-4xl mx-auto font-serif text-[15px] leading-snug print:p-0 print:m-0 bg-white"><!--[-->`);
    const each_array = ensure_array_like(Object.entries(participantsGrouped));
    for (let roomIdx = 0, $$length = each_array.length; roomIdx < $$length; roomIdx++) {
      let [roomName, sessionsDict] = each_array[roomIdx];
      $$renderer2.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(Object.entries(sessionsDict));
      for (let sessionIdx = 0, $$length2 = each_array_1.length; sessionIdx < $$length2; sessionIdx++) {
        let [sessionNumStr, count] = each_array_1[sessionIdx];
        const sessionNum = parseInt(sessionNumStr);
        $$renderer2.push(`<div${attr_class(clsx(roomIdx > 0 || sessionIdx > 0 ? "break-before-page pt-8" : ""))}><div class="text-center mb-4 pb-3 border-b-4 border-black flex items-center relative">`);
        if (school?.logo_url) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<img${attr("src", school.logo_url)} alt="Logo" class="w-20 h-20 object-contain absolute left-0"/>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="flex-1 px-24"><h2 class="font-bold text-lg uppercase tracking-wide m-0">PANITIA PENYELENGGARA UJIAN</h2> <h3 class="font-bold text-xl uppercase m-0">${escape_html(school?.name || "NAMA SEKOLAH")}</h3> `);
        if (school?.address) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="text-sm mt-1 mb-0">${escape_html(school.address)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (school?.website || school?.email) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="text-xs m-0">Website: ${escape_html(school.website || "-")} | Email: ${escape_html(school.email || "-")}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div> <div class="text-center mb-4"><h4 class="font-bold text-lg uppercase underline">BERITA ACARA PELAKSANAAN UJIAN</h4></div> <div class="text-justify mb-4"><p class="mb-3">Pada hari ini <span class="font-bold">${escape_html(exam.start_time ? parseDate(exam.start_time).toLocaleDateString("id-ID", { weekday: "long" }) : "..................")}</span> tanggal <span class="font-bold">${escape_html(exam.start_time ? parseDate(exam.start_time).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "..............................")}</span>, telah diselenggarakan Ujian untuk mata pelajaran <span class="font-bold">${escape_html(exam.subject_name || "Umum")}</span> dari pukul <span class="font-bold">${escape_html(exam.start_time ? parseDate(exam.start_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "....")}</span> sampai dengan pukul <span class="font-bold">${escape_html(exam.end_time ? parseDate(exam.end_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "....")}</span>.</p> <table class="w-full mb-4"><tbody><tr><td class="py-1 w-8">1.</td><td class="py-1 w-60">Nama Ujian</td><td class="py-1 w-4">:</td><td class="py-1 font-bold">${escape_html(exam.exam_type_name || exam.title)}</td></tr><tr><td class="py-1">2.</td><td class="py-1">Mata Pelajaran</td><td class="py-1">:</td><td class="py-1 font-bold">${escape_html(exam.subject_name || "Umum")}</td></tr><tr><td class="py-1">3.</td><td class="py-1">Ruang / Sesi</td><td class="py-1">:</td><td class="py-1 font-bold">${escape_html(roomName)} / Sesi ${escape_html(sessionNum)}</td></tr><tr><td class="py-1">4.</td><td class="py-1">Jumlah Peserta Seharusnya</td><td class="py-1">:</td><td class="py-1 font-bold">${escape_html(count)} Orang</td></tr><tr><td class="py-1">5.</td><td class="py-1">Jumlah Peserta Hadir</td><td class="py-1">:</td><td class="py-1 font-bold">.......... Orang</td></tr><tr><td class="py-1">6.</td><td class="py-1">Jumlah Peserta Tidak Hadir</td><td class="py-1">:</td><td class="py-1 font-bold">.......... Orang</td></tr><tr><td class="py-1 align-top">7.</td><td class="py-1 align-top">${escape_html(isNomorPesertaMode ? "Nomor Peserta Tidak Hadir" : "NISN Tidak Hadir")}</td><td class="py-1 align-top">:</td><td class="py-1 align-top text-slate-400 italic">.......................................................................................<br/><br/>.......................................................................................</td></tr></tbody></table> <p class="mb-1">Catatan selama pelaksanaan ujian / Kejadian penting:</p> <div class="border border-black p-2 h-16 rounded-sm mb-4 bg-transparent"></div> <p class="mb-2">Demikian berita acara ini dibuat dengan sesungguhnya untuk dapat dipergunakan sebagaimana mestinya.</p></div> <div class="mt-4 px-4 text-sm"><div class="flex justify-end mb-2"><p>............, ....................................</p></div> <div class="flex justify-between mb-2"><div class="text-center w-52"><p class="mb-10">Pengawas 1</p> <p class="font-bold border-b border-black w-full text-transparent">.............................</p> <p class="mt-1 text-left">NIP.</p></div> <div class="text-center w-52"><p class="mb-10">Pengawas 2</p> <p class="font-bold border-b border-black w-full text-transparent">.............................</p> <p class="mt-1 text-left">NIP.</p></div></div> <div class="flex justify-between mb-2"><div class="text-center w-52"><p class="mb-10">Proktor / Teknisi</p> <p class="font-bold border-b border-black w-full text-transparent">.............................</p> <p class="mt-1 text-left">NIP.</p></div> <div class="text-center w-52"><p class="mb-10">Panitia Ujian</p> <p class="font-bold border-b border-black w-full text-transparent">.............................</p> <p class="mt-1 text-left">NIP.</p></div></div> <div class="flex justify-center"><div class="text-center w-60"><p class="mb-1">Mengetahui,</p> <p class="mb-10">Kepala Madrasah</p> <p class="font-bold border-b border-black w-full text-transparent">...................................</p> <p class="mt-1 text-left">NIP.</p></div></div></div></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> `);
    if (Object.keys(participantsGrouped).length === 0) {
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
