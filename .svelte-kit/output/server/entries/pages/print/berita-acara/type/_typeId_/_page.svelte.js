import { h as head, i as ensure_array_like, j as attr_class, l as clsx, e as escape_html, k as attr, f as bind_props } from "../../../../../../chunks/index.js";
import { p as parseDate } from "../../../../../../chunks/date.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let school, examType, examDataList;
    let data = $$props["data"];
    let selectedTimezone = "WIB";
    function resolveStart(sessionData, exam) {
      if (sessionData?.start_time && sessionData.start_time.trim()) {
        const s = sessionData.start_time.trim();
        if (s.includes("-") || s.includes("/")) return s;
        const baseDateStr = exam?.start_time || exam?.exam_type_start_time || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
        const datePart = baseDateStr.split(/[T ]/)[0];
        return `${datePart}T${s.slice(0, 5)}:00`;
      }
      if (exam?.start_time && exam.start_time.trim()) {
        return exam.start_time.trim();
      }
      if (exam?.exam_type_start_time && exam.exam_type_start_time.trim()) {
        return exam.exam_type_start_time.trim();
      }
      return null;
    }
    function resolveEnd(sessionData, exam) {
      if (sessionData?.end_time && sessionData.end_time.trim()) {
        const s = sessionData.end_time.trim();
        if (s.includes("-") || s.includes("/")) return s;
        const baseDateStr = exam?.end_time || exam?.start_time || exam?.exam_type_end_time || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
        const datePart = baseDateStr.split(/[T ]/)[0];
        return `${datePart}T${s.slice(0, 5)}:00`;
      }
      if (exam?.end_time && exam.end_time.trim()) {
        return exam.end_time.trim();
      }
      if (exam?.exam_type_end_time && exam.exam_type_end_time.trim()) {
        return exam.exam_type_end_time.trim();
      }
      return null;
    }
    function getAcademicYear(dateStr) {
      if (!dateStr) return "2025/2026";
      const d = parseDate(dateStr);
      const validDate = isNaN(d.getTime()) ? /* @__PURE__ */ new Date() : d;
      const year = validDate.getFullYear();
      const month = validDate.getMonth() + 1;
      if (month >= 7) {
        return `${year}/${year + 1}`;
      } else {
        return `${year - 1}/${year}`;
      }
    }
    function getDayName(dateStr) {
      if (!dateStr) return "................";
      const d = parseDate(dateStr);
      if (isNaN(d.getTime())) return "................";
      return d.toLocaleDateString("id-ID", { weekday: "long" });
    }
    function getDayNumber(dateStr) {
      if (!dateStr) return "......";
      const d = parseDate(dateStr);
      if (isNaN(d.getTime())) return "......";
      return d.getDate().toString();
    }
    function getMonthName(dateStr) {
      if (!dateStr) return "................";
      const d = parseDate(dateStr);
      if (isNaN(d.getTime())) return "................";
      return d.toLocaleDateString("id-ID", { month: "long" });
    }
    function getYearNumber(dateStr) {
      if (!dateStr) return "..........";
      const d = parseDate(dateStr);
      if (isNaN(d.getTime())) return "..........";
      return d.getFullYear().toString();
    }
    function formatDateFull(dateStr) {
      if (!dateStr) return "......................";
      const date = parseDate(dateStr);
      if (isNaN(date.getTime())) return "......................";
      return date.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
    }
    function formatTime(timeStr) {
      if (!timeStr) return "....";
      const str = String(timeStr).trim();
      if (str.includes("T")) return str.split("T")[1].slice(0, 5).replace(":", ".");
      if (str.includes(" ")) return str.split(" ")[1].slice(0, 5).replace(":", ".");
      if (str.includes(":")) return str.slice(0, 5).replace(":", ".");
      return str;
    }
    school = data.school;
    examType = data.examType;
    data.isNomorPesertaMode;
    examDataList = data.examDataList || [];
    head("egdvpq", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Cetak Semua Berita Acara - ${escape_html(examType.name)}</title>`);
      });
    });
    $$renderer2.push(`<div class="no-print p-4 bg-slate-800 text-white border-b border-slate-700 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-md svelte-egdvpq"><div class="flex items-center gap-2"><label for="tz-select" class="text-xs text-slate-300 font-medium">Zona Waktu:</label> `);
    $$renderer2.select(
      {
        id: "tz-select",
        value: selectedTimezone,
        class: "bg-slate-700 text-white text-xs border border-slate-600 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-400"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "WIB" }, ($$renderer4) => {
          $$renderer4.push(`WIB (Waktu Indonesia Barat)`);
        });
        $$renderer3.option({ value: "WITA" }, ($$renderer4) => {
          $$renderer4.push(`WITA (Waktu Indonesia Tengah)`);
        });
        $$renderer3.option({ value: "WIT" }, ($$renderer4) => {
          $$renderer4.push(`WIT (Waktu Indonesia Timur)`);
        });
      }
    );
    $$renderer2.push(`</div> <div class="flex items-center gap-2"><button class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium transition-colors">Tutup</button> <button class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak Semua Berita Acara</button></div></div> <div class="p-4 md:p-8 max-w-[215.9mm] mx-auto font-serif text-[15px] leading-snug print:p-0 print:m-0 bg-white" style="font-family: 'Times New Roman', Times, Arial, serif; font-variant-numeric: lining-nums tabular-nums;">`);
    if (examDataList.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-12 text-center text-slate-500 italic font-sans">Belum ada ujian terdaftar pada tipe ujian ini.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <!--[-->`);
    const each_array = ensure_array_like(examDataList);
    for (let examIdx = 0, $$length = each_array.length; examIdx < $$length; examIdx++) {
      let item = each_array[examIdx];
      const locationStr = [
        school?.district ? `Kecamatan ${school.district}` : "",
        school?.city ? school.city.toLowerCase().startsWith("kab") || school.city.toLowerCase().startsWith("kota") ? school.city : `Kabupaten ${school.city}` : "",
        school?.province ? school.province : ""
      ].filter(Boolean).join(", ");
      const locationCity = school?.address ? school.address.split(",")[0].trim() : school?.city ? school.city.replace(/^(kab\.|kabupaten|kota)\s+/i, "") : "....................";
      const exam = item.exam;
      const participantsGrouped = item.participantsGrouped;
      const sessionMap = item.sessionMap;
      const proctorOptions = item.proctorOptions;
      const defaultProctor1Id = item.defaultProctor1Id;
      const defaultProctor2Id = item.defaultProctor2Id;
      const defaultProctorTechId = item.defaultProctorTechId;
      const defaultCommitteeId = item.defaultCommitteeId;
      const proctor1 = proctorOptions.find((p) => String(p.id) === String(defaultProctor1Id));
      const proctor2 = proctorOptions.find((p) => String(p.id) === String(defaultProctor2Id));
      const proctorTech = proctorOptions.find((p) => String(p.id) === String(defaultProctorTechId));
      const committee = proctorOptions.find((p) => String(p.id) === String(defaultCommitteeId));
      $$renderer2.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(Object.entries(participantsGrouped));
      for (let roomIdx = 0, $$length2 = each_array_1.length; roomIdx < $$length2; roomIdx++) {
        let [roomName, sessionsDict] = each_array_1[roomIdx];
        $$renderer2.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(Object.entries(sessionsDict));
        for (let sessionIdx = 0, $$length3 = each_array_2.length; sessionIdx < $$length3; sessionIdx++) {
          let [sessionNumStr, count] = each_array_2[sessionIdx];
          const sessionNum = parseInt(sessionNumStr);
          const sessionData = sessionMap?.[sessionNum];
          const effectiveStart = resolveStart(sessionData, exam);
          const effectiveEnd = resolveEnd(sessionData, exam);
          const activeOfficers = [
            { role: "Pengawas I", data: proctor1, id: "p1" },
            { role: "Pengawas II", data: proctor2, id: "p2" },
            { role: "Proktor / Teknisi", data: proctorTech, id: "pt" },
            { role: "Panitia Ujian", data: committee, id: "cm" }
          ].filter((o) => o.id === "p1" && defaultProctor1Id || o.id !== "p1" && o.data);
          $$renderer2.push(`<div${attr_class(clsx(examIdx > 0 || roomIdx > 0 || sessionIdx > 0 ? "break-before-page pt-8 print:pt-0" : ""), "svelte-egdvpq")}><div class="flex items-center justify-between gap-4 pb-2 relative"><img src="/kemenag.png" alt="Logo Kemenag" class="w-20 h-20 object-contain shrink-0"/> <div class="flex-1 text-center font-serif px-2"><h4 class="font-semibold text-sm uppercase tracking-wider text-black m-0 leading-tight">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h4> <h3 class="font-bold text-xl uppercase tracking-wide text-black m-0 my-0.5">${escape_html(school?.name || "NAMA MADRASAH")}</h3> `);
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
          $$renderer2.push(`<!--]--></div> <div class="mt-2 mb-3"><div class="border-b-2 border-black w-full"></div> <div class="border-b border-black w-full mt-0.5"></div></div> <div class="text-center mb-4"><h2 class="font-bold text-base uppercase underline tracking-wide m-0">BERITA ACARA PELAKSANAAN UJIAN</h2> <p class="text-xs mt-1 uppercase font-semibold">TAHUN PELAJARAN ${escape_html(getAcademicYear(effectiveStart))}</p></div> <p class="text-justify mb-3 leading-relaxed">Pada hari ini <span class="font-semibold">${escape_html(getDayName(effectiveStart))}</span> tanggal <span class="font-semibold">${escape_html(getDayNumber(effectiveStart))}</span> bulan <span class="font-semibold">${escape_html(getMonthName(effectiveStart))}</span> tahun <span class="font-semibold">${escape_html(getYearNumber(effectiveStart))}</span>, 
						pada <span class="font-semibold">${escape_html(school?.name || "Madrasah")}</span> telah diselenggarakan <span class="font-semibold">${escape_html(exam.exam_type_name || exam.title)}</span> untuk Mata Pelajaran <span class="font-semibold">${escape_html(exam.subject_name || "Umum")}</span> dari pukul <span class="font-semibold">${escape_html(formatTime(effectiveStart))}</span> sampai dengan pukul <span class="font-semibold">${escape_html(formatTime(effectiveEnd))}</span> ${escape_html(selectedTimezone)}.</p> <div class="space-y-3 mb-4"><div class="flex items-start gap-2"><span class="font-bold w-4">1.</span> <div class="flex-1"><table class="w-full"><tbody><tr><td class="w-48 py-0.5">Ruang / Sesi Ujian</td><td class="w-4 py-0.5">:</td><td class="font-semibold py-0.5">${escape_html(roomName)} `);
          if (item.hasSessions) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`/ Sesi ${escape_html(sessionNum)}`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></td></tr><tr><td class="py-0.5">Jumlah Peserta Seharusnya</td><td class="py-0.5">:</td><td class="py-0.5"><span class="font-semibold">${escape_html(count)}</span> Orang</td></tr><tr><td class="py-0.5">Jumlah Peserta Hadir</td><td class="py-0.5">:</td><td class="py-0.5"><span class="font-semibold">${escape_html(count)}</span> Orang</td></tr><tr><td class="py-0.5">Jumlah Peserta Tidak Hadir</td><td class="py-0.5">:</td><td class="py-0.5"><span class="font-semibold">0</span> Orang</td></tr></tbody></table></div></div> <div class="flex items-start gap-2"><span class="font-bold w-4">2.</span> <div class="flex-1"><p class="m-0 mb-1">Catatan Selama Pelaksanaan Ujian:</p> <div class="border border-black p-3 rounded min-h-[60px] text-xs italic bg-slate-50/50">Pelaksanaan ujian berlangsung tertib, lancar, dan aman tanpa kendala teknis yang berarti.</div></div></div></div> <p class="mb-4">Demikian Berita Acara ini dibuat dengan sesungguhnya untuk dipergunakan sebagaimana mestinya.</p> <div class="flex justify-end mb-4"><div class="text-right text-xs">${escape_html(locationCity)}, ${escape_html(formatDateFull(effectiveStart))}</div></div> <div class="mt-4 pt-2 border-t border-slate-300"><p class="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3 text-center">Yang Membuat Berita Acara:</p> <div class="grid grid-cols-2 gap-x-8 gap-y-6 text-xs"><!--[-->`);
          const each_array_3 = ensure_array_like(activeOfficers);
          for (let $$index = 0, $$length4 = each_array_3.length; $$index < $$length4; $$index++) {
            let officer = each_array_3[$$index];
            $$renderer2.push(`<div class="text-center"><p class="mb-12 font-medium">${escape_html(officer.role)},</p> <p class="border-b border-black font-bold inline-block px-3">${escape_html(officer.data?.name || "( .................................... )")}</p> <p class="text-[11px] mt-0.5">NIP. ${escape_html(officer.data?.nip || "..............................")}</p></div>`);
          }
          $$renderer2.push(`<!--]--></div></div></div>`);
        }
        $$renderer2.push(`<!--]-->`);
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
