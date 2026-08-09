import { h as head, k as attr, e as escape_html, f as bind_props } from "../../../../../chunks/index.js";
import { p as parseDate } from "../../../../../chunks/date.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let school, exam, totalParticipants;
    let data = $$props["data"];
    school = data.school;
    exam = data.exam;
    totalParticipants = data.totalParticipants;
    head("npx4lb", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Berita Acara - ${escape_html(exam.title)}</title>`);
      });
    });
    $$renderer2.push(`<div class="p-8 max-w-4xl mx-auto font-serif"><div class="text-center mb-6 pb-4 border-b-4 border-black flex items-center">`);
    if (school?.logo_url) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<img${attr("src", school.logo_url)} alt="Logo" class="w-24 h-24 object-contain absolute"/>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="flex-1"><h2 class="font-bold text-xl uppercase tracking-wide">PANITIA PENYELENGGARA UJIAN</h2> <h3 class="font-bold text-2xl uppercase">${escape_html(school?.name || "NAMA SEKOLAH")}</h3> `);
    if (school?.address) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-base mt-1">${escape_html(school.address)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (school?.website || school?.email) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-sm">Website: ${escape_html(school.website || "-")} | Email: ${escape_html(school.email || "-")}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="text-center mb-8"><h4 class="font-bold text-xl uppercase underline">BERITA ACARA PELAKSANAAN UJIAN</h4></div> <div class="text-justify leading-relaxed mb-6"><p class="mb-4">Pada hari ini <span class="font-bold">${escape_html(exam.start_time ? parseDate(exam.start_time).toLocaleDateString("id-ID", { weekday: "long" }) : "..................")}</span> tanggal <span class="font-bold">${escape_html(exam.start_time ? parseDate(exam.start_time).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "..............................")}</span>, telah diselenggarakan Ujian untuk mata pelajaran <span class="font-bold">${escape_html(exam.subject_name || "Umum")}</span> dari pukul <span class="font-bold">${escape_html(exam.start_time ? parseDate(exam.start_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "....")}</span> sampai dengan pukul <span class="font-bold">${escape_html(exam.end_time ? parseDate(exam.end_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "....")}</span>.</p> <table class="w-full mb-6 mt-4"><tbody><tr><td class="py-2 w-8">1.</td><td class="py-2 w-64">Nama Ujian</td><td class="py-2 w-4">:</td><td class="py-2 font-bold">${escape_html(exam.title)}</td></tr><tr><td class="py-2">2.</td><td class="py-2">Mata Pelajaran</td><td class="py-2">:</td><td class="py-2 font-bold">${escape_html(exam.subject_name || "Umum")}</td></tr><tr><td class="py-2">3.</td><td class="py-2">Ruang / Kelas</td><td class="py-2">:</td><td class="py-2 font-bold">................................................</td></tr><tr><td class="py-2">4.</td><td class="py-2">Jumlah Peserta Seharusnya</td><td class="py-2">:</td><td class="py-2 font-bold">${escape_html(totalParticipants)} Orang</td></tr><tr><td class="py-2">5.</td><td class="py-2">Jumlah Peserta Hadir</td><td class="py-2">:</td><td class="py-2 font-bold">.......... Orang</td></tr><tr><td class="py-2">6.</td><td class="py-2">Jumlah Peserta Tidak Hadir</td><td class="py-2">:</td><td class="py-2 font-bold">.......... Orang</td></tr><tr><td class="py-2 align-top">7.</td><td class="py-2 align-top">Nomor Peserta Tidak Hadir</td><td class="py-2 align-top">:</td><td class="py-2 align-top text-slate-400 italic">.......................................................................................<br/><br/>.......................................................................................</td></tr></tbody></table> <p class="mb-4">Catatan selama pelaksanaan ujian / Kejadian penting:</p> <div class="border border-black p-4 h-32 rounded-sm mb-6 bg-slate-50/50"></div> <p class="mb-8">Demikian berita acara ini dibuat dengan sesungguhnya untuk dapat dipergunakan sebagaimana mestinya.</p></div> <div class="flex justify-between mt-12 px-8"><div class="text-center"><p class="mb-24">Proktor / Teknisi</p> <p class="font-bold border-b border-black inline-block px-4">........................................</p> <p class="mt-1">NIP. ........................................</p></div> <div class="text-center"><p class="mb-2">............, ....................................</p> <p class="mb-20">Pengawas Ruang</p> <p class="font-bold border-b border-black inline-block px-4">........................................</p> <p class="mt-1">NIP. ........................................</p></div></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
