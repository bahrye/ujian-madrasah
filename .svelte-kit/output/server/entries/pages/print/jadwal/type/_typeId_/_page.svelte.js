import { h as head, i as ensure_array_like, j as attr_class, e as escape_html, k as attr, f as bind_props } from "../../../../../../chunks/index.js";
import { p as parseDate } from "../../../../../../chunks/date.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    const { school, examType, participants } = data;
    function formatDate(dateStr) {
      if (!dateStr || dateStr === "-") return "-";
      const date = parseDate(dateStr);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
    function formatTime(timeStr) {
      if (!timeStr) return "--:--";
      if (timeStr.length <= 5) return timeStr;
      if (timeStr.includes("T")) return timeStr.split("T")[1].slice(0, 5);
      if (timeStr.includes(" ")) return timeStr.split(" ")[1].slice(0, 5);
      return timeStr.slice(0, 5);
    }
    head("26gna5", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Cetak Jadwal Ujian - ${escape_html(examType.name)}</title>`);
      });
      $$renderer3.push(`<style>
		@media print {
			@page {
				size: A4;
				margin: 1cm;
			}
			body {
				-webkit-print-color-adjust: exact;
				print-color-adjust: exact;
			}
			.page-break {
				-moz-column-break-after: page;
				     break-after: page;
				page-break-after: always;
			}
			.no-print {
				display: none !important;
			}
		}
	</style>`);
    });
    $$renderer2.push(`<div class="no-print p-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center fixed top-0 left-0 right-0 z-50"><div class="text-sm text-slate-600">Gunakan pengaturan <strong>Kertas A4</strong> dan <strong>Skala Default</strong> saat mencetak.</div> <div class="flex gap-3"><button class="btn-ghost">Tutup</button> <button class="btn-primary"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak Jadwal</button></div></div> <div class="mt-20 print:mt-0 max-w-[21cm] mx-auto bg-white">`);
    if (participants.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-12 text-center text-slate-500">Tidak ada data peserta ujian untuk ditampilkan.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <!--[-->`);
    const each_array = ensure_array_like(participants);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let p = each_array[i];
      const locationStr = [
        school?.district ? `Kecamatan ${school.district}` : "",
        school?.city ? school.city.toLowerCase().startsWith("kab") || school.city.toLowerCase().startsWith("kota") ? school.city : `Kabupaten ${school.city}` : "",
        school?.province ? school.province : ""
      ].filter(Boolean).join(", ");
      $$renderer2.push(`<div${attr_class(`p-8 print:p-0 ${i < participants.length - 1 ? "page-break mb-8 print:mb-0 border-b-8 print:border-b-0 border-slate-100" : ""}`)}><div class="flex items-center justify-between gap-4 pb-2 relative"><img src="/kemenag.png" alt="Logo Kemenag" class="w-20 h-20 object-contain shrink-0"/> <div class="flex-1 text-center font-serif px-2"><h4 class="font-semibold text-sm uppercase tracking-wider text-black m-0 leading-tight">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h4> <h3 class="font-bold text-xl uppercase tracking-wide text-black m-0 my-0.5">${escape_html(school?.name || "NAMA SEKOLAH")}</h3> `);
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
      $$renderer2.push(`<!--]--></div> <div class="mt-2 mb-5"><div style="border-bottom: 1px solid #000;"></div> <div style="border-bottom: 2.5px solid #000; margin-top: 2px;"></div></div> <div class="text-center mb-5 font-serif"><h2 class="font-bold text-lg uppercase underline tracking-wider m-0">JADWAL UJIAN PESERTA</h2> <p class="text-xs font-semibold text-slate-700 uppercase mt-0.5">${escape_html(examType.name)}</p></div> <div class="mb-6"><table class="text-sm w-full max-w-md"><tbody><tr><td class="py-1 w-32 font-medium">Nama Peserta</td><td class="py-1 w-4 text-center">:</td><td class="py-1 font-bold">${escape_html(p.student_name)}</td></tr><tr><td class="py-1 font-medium">NISN</td><td class="py-1 text-center">:</td><td class="py-1">${escape_html(p.nisn || "-")}</td></tr><tr><td class="py-1 font-medium">Nomor Peserta</td><td class="py-1 text-center">:</td><td class="py-1">${escape_html(p.nomor_peserta || "-")}</td></tr><tr><td class="py-1 font-medium">Kelas</td><td class="py-1 text-center">:</td><td class="py-1">${escape_html(p.class_name || "-")}</td></tr></tbody></table></div> <div class="border border-black"><table class="w-full text-sm text-left"><thead class="bg-gray-100 border-b border-black"><tr><th class="py-2 px-3 border-r border-black w-12 text-center">No</th><th class="py-2 px-3 border-r border-black">Hari, Tanggal</th><th class="py-2 px-3 border-r border-black">Mata Pelajaran</th><th class="py-2 px-3 border-r border-black text-center">Waktu</th><th class="py-2 px-3 border-r border-black text-center w-24">Sesi</th><th class="py-2 px-3 text-center w-32">Ruang</th></tr></thead><tbody>`);
      if (p.schedules && p.schedules.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(p.schedules);
        for (let idx = 0, $$length2 = each_array_1.length; idx < $$length2; idx++) {
          let schedule = each_array_1[idx];
          $$renderer2.push(`<tr class="border-b border-black last:border-b-0"><td class="py-2 px-3 border-r border-black text-center">${escape_html(idx + 1)}</td><td class="py-2 px-3 border-r border-black whitespace-nowrap">${escape_html(formatDate(schedule.date))}</td><td class="py-2 px-3 border-r border-black font-medium">${escape_html(schedule.subject_name || schedule.exam_title)}</td><td class="py-2 px-3 border-r border-black text-center whitespace-nowrap">${escape_html(formatTime(schedule.start_time))} - ${escape_html(formatTime(schedule.end_time))}</td><td class="py-2 px-3 border-r border-black text-center">${escape_html(schedule.has_sessions ? `Sesi ${schedule.session_number}` : "-")}</td><td class="py-2 px-3 text-center font-medium">${escape_html(schedule.room_name)}</td></tr>`);
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<tr><td colspan="6" class="py-8 text-center text-gray-500 italic">Belum ada jadwal ujian yang ditugaskan.</td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div> <div class="mt-8 flex justify-end"><div class="text-center text-sm w-48"><div class="mb-16">Panitia Ujian,</div> <div class="border-b border-black w-full mb-1"></div> <div class="text-xs">NIP. ..............................</div></div></div></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
