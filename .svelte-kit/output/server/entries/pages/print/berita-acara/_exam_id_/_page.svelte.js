import { h as head, i as ensure_array_like, e as escape_html, j as attr_class, l as clsx, k as attr, f as bind_props } from "../../../../../chunks/index.js";
import { p as parseDate } from "../../../../../chunks/date.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let school, exam, participantsGrouped, sessionMap, proctorOptions, proctor1, proctor2, proctorTech, committee;
    let data = $$props["data"];
    let proctor1Id = data.defaultProctor1Id || (proctorOptions[0]?.id || "");
    let proctor2Id = data.defaultProctor2Id || "";
    let proctorTechId = "";
    let committeeId = "";
    function resolveStart(sessionData, exam2) {
      if (sessionData?.start_time && sessionData.start_time.trim()) {
        const s = sessionData.start_time.trim();
        if (s.includes("-") || s.includes("/")) return s;
        const baseDateStr = exam2?.start_time || exam2?.exam_type_start_time || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
        const datePart = baseDateStr.split(/[T ]/)[0];
        return `${datePart}T${s.slice(0, 5)}:00`;
      }
      if (exam2?.start_time && exam2.start_time.trim()) {
        return exam2.start_time.trim();
      }
      if (exam2?.exam_type_start_time && exam2.exam_type_start_time.trim()) {
        return exam2.exam_type_start_time.trim();
      }
      return null;
    }
    function resolveEnd(sessionData, exam2) {
      if (sessionData?.end_time && sessionData.end_time.trim()) {
        const s = sessionData.end_time.trim();
        if (s.includes("-") || s.includes("/")) return s;
        const baseDateStr = exam2?.end_time || exam2?.start_time || exam2?.exam_type_end_time || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
        const datePart = baseDateStr.split(/[T ]/)[0];
        return `${datePart}T${s.slice(0, 5)}:00`;
      }
      if (exam2?.end_time && exam2.end_time.trim()) {
        return exam2.end_time.trim();
      }
      if (exam2?.exam_type_end_time && exam2.exam_type_end_time.trim()) {
        return exam2.exam_type_end_time.trim();
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
    exam = data.exam;
    participantsGrouped = data.participantsGrouped;
    data.isNomorPesertaMode;
    sessionMap = data.sessionMap;
    proctorOptions = data.proctorOptions || [];
    proctor1 = proctorOptions.find((p) => String(p.id) === String(proctor1Id));
    proctor2 = proctorOptions.find((p) => String(p.id) === String(proctor2Id));
    proctorTech = proctorOptions.find((p) => String(p.id) === String(proctorTechId));
    committee = proctorOptions.find((p) => String(p.id) === String(committeeId));
    head("npx4lb", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Berita Acara - ${escape_html(exam.exam_type_name || exam.title)}</title>`);
      });
    });
    $$renderer2.push(`<div class="no-print p-4 bg-slate-800 text-white border-b border-slate-700 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-md svelte-npx4lb"><div class="flex items-center gap-4 flex-wrap"><span class="text-xs font-semibold uppercase tracking-wider text-slate-300">Pengaturan TTD Petugas:</span> <div class="flex items-center gap-1.5"><label for="p1-select" class="text-xs text-slate-300 font-medium">Pengawas 1:</label> `);
    $$renderer2.select(
      {
        id: "p1-select",
        value: proctor1Id,
        class: "bg-slate-700 text-white text-xs border border-slate-600 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-400 max-w-[140px]"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`-- Pilih Pengawas 1 --`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(proctorOptions);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let p = each_array[$$index];
          $$renderer3.option({ value: p.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(p.name)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <div class="flex items-center gap-1.5"><label for="p2-select" class="text-xs text-slate-300 font-medium">Pengawas 2:</label> `);
    $$renderer2.select(
      {
        id: "p2-select",
        value: proctor2Id,
        class: "bg-slate-700 text-white text-xs border border-slate-600 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-400 max-w-[140px]"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`-- Kosongkan --`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(proctorOptions);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let p = each_array_1[$$index_1];
          $$renderer3.option({ value: p.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(p.name)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <div class="flex items-center gap-1.5"><label for="pt-select" class="text-xs text-slate-300 font-medium">Proktor/Teknisi:</label> `);
    $$renderer2.select(
      {
        id: "pt-select",
        value: proctorTechId,
        class: "bg-slate-700 text-white text-xs border border-slate-600 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-400 max-w-[140px]"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`-- Kosongkan --`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(proctorOptions);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let p = each_array_2[$$index_2];
          $$renderer3.option({ value: p.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(p.name)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <div class="flex items-center gap-1.5"><label for="cm-select" class="text-xs text-slate-300 font-medium">Panitia Ujian:</label> `);
    $$renderer2.select(
      {
        id: "cm-select",
        value: committeeId,
        class: "bg-slate-700 text-white text-xs border border-slate-600 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-400 max-w-[140px]"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`-- Kosongkan --`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array_3 = ensure_array_like(proctorOptions);
        for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
          let p = each_array_3[$$index_3];
          $$renderer3.option({ value: p.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(p.name)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div></div> <div class="flex items-center gap-2"><button class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium transition-colors">Tutup</button> <button class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak Berita Acara</button></div></div> <div class="p-4 md:p-8 max-w-[215.9mm] mx-auto font-serif text-[15px] leading-snug print:p-0 print:m-0 bg-white" style="font-family: 'Times New Roman', Times, Arial, serif; font-variant-numeric: lining-nums tabular-nums;"><!--[-->`);
    const each_array_4 = ensure_array_like(Object.entries(participantsGrouped));
    for (let roomIdx = 0, $$length = each_array_4.length; roomIdx < $$length; roomIdx++) {
      let [roomName, sessionsDict] = each_array_4[roomIdx];
      $$renderer2.push(`<!--[-->`);
      const each_array_5 = ensure_array_like(Object.entries(sessionsDict));
      for (let sessionIdx = 0, $$length2 = each_array_5.length; sessionIdx < $$length2; sessionIdx++) {
        let [sessionNumStr, count] = each_array_5[sessionIdx];
        const sessionNum = parseInt(sessionNumStr);
        const sessionData = sessionMap?.[sessionNum];
        const effectiveStart = resolveStart(sessionData, exam);
        const effectiveEnd = resolveEnd(sessionData, exam);
        const locationStr = [
          school?.district ? `Kecamatan ${school.district}` : "",
          school?.city ? school.city.toLowerCase().startsWith("kab") || school.city.toLowerCase().startsWith("kota") ? school.city : `Kabupaten ${school.city}` : "",
          school?.province ? school.province : ""
        ].filter(Boolean).join(", ");
        const locationCity = school?.address ? school.address.split(",")[0].trim() : school?.city ? school.city.replace(/^(kab\.|kabupaten|kota)\s+/i, "") : "....................";
        const activeOfficers = [
          { role: "Pengawas I", data: proctor1, id: "p1" },
          { role: "Pengawas II", data: proctor2, id: "p2" },
          { role: "Proktor / Teknisi", data: proctorTech, id: "pt" },
          { role: "Panitia Ujian", data: committee, id: "cm" }
        ].filter((o) => o.id === "p1" && proctor1Id || o.id !== "p1" && o.data);
        $$renderer2.push(`<div${attr_class(clsx(roomIdx > 0 || sessionIdx > 0 ? "break-before-page pt-8" : ""), "svelte-npx4lb")}><div class="flex items-center justify-between gap-4 pb-2 relative"><img src="/kemenag.png" alt="Logo Kemenag" class="w-20 h-20 object-contain shrink-0"/> <div class="flex-1 text-center font-serif px-2"><h4 class="font-semibold text-sm uppercase tracking-wider text-black m-0 leading-tight">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h4> <h3 class="font-bold text-xl uppercase tracking-wide text-black m-0 my-0.5">${escape_html(school?.name || "NAMA SEKOLAH")}</h3> `);
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
        $$renderer2.push(`<!--]--></div> <div class="mt-2 mb-3"><div style="border-bottom: 1px solid #000;"></div> <div style="border-bottom: 2.5px solid #000; margin-top: 2px;"></div></div> <div class="text-center mb-3"><h1 class="font-bold text-lg uppercase underline tracking-wider mb-0.5">BERITA ACARA PELAKSANAAN UJIAN</h1> <p class="text-sm font-medium">Tahun Ajaran ${escape_html(getAcademicYear(effectiveStart))}</p></div> <p class="mb-2 text-justify">Pada hari ini <span class="border-b border-dotted border-black px-2">${escape_html(getDayName(effectiveStart))}</span> tanggal <span class="border-b border-dotted border-black px-2">${escape_html(getDayNumber(effectiveStart))}</span> bulan <span class="border-b border-dotted border-black px-2">${escape_html(getMonthName(effectiveStart))}</span> tahun <span class="border-b border-dotted border-black px-2">${escape_html(getYearNumber(effectiveStart))}</span>, 
				telah diselenggarakan <strong class="uppercase">${escape_html(exam.exam_type_name || exam.title)}</strong> Mata Pelajaran <strong>${escape_html(exam.subject_name || "Umum")}</strong> untuk:</p> <div class="ml-4 mb-3"><table class="w-full"><tbody><tr class="align-top"><td class="w-48 py-0.5">a. Satuan Pendidikan</td><td class="w-4 py-0.5">:</td><td class="py-0.5 font-bold uppercase">${escape_html(school?.name || "-")}</td></tr><tr class="align-top"><td class="py-0.5">b. Ruang / Sesi Ujian</td><td class="py-0.5">:</td><td class="py-0.5 font-bold">${escape_html(roomName)} / Sesi ${escape_html(sessionNum)}</td></tr><tr class="align-top"><td class="py-0.5">c. Waktu Pelaksanaan</td><td class="py-0.5">:</td><td class="py-0.5">${escape_html(formatTime(effectiveStart))} s.d. ${escape_html(formatTime(effectiveEnd))} WIB</td></tr><tr class="align-top"><td class="py-0.5">d. Jumlah Peserta Seharusnya</td><td class="py-0.5">:</td><td class="py-0.5">${escape_html(count)} Orang</td></tr><tr class="align-top"><td class="py-0.5">e. Jumlah Peserta Hadir</td><td class="py-0.5">:</td><td class="py-0.5">........... Orang</td></tr><tr class="align-top"><td class="py-0.5">f. Jumlah Peserta Tidak Hadir</td><td class="py-0.5">:</td><td class="py-0.5">........... Orang</td></tr><tr class="align-top"><td class="py-1 pl-4 text-sm font-serif" colspan="3"><div class="flex items-baseline gap-2"><span>- Nomor Peserta yang Tidak Hadir:</span> <span class="border-b border-dotted border-black flex-1 min-h-[1.1rem]"></span></div> <div class="mt-1"><span class="border-b border-dotted border-black block w-full min-h-[1.1rem]"></span></div></td></tr></tbody></table></div> <div class="mb-3"><p class="mb-1 font-bold text-sm">Catatan / Kejadian Penting Selama Ujian Berlangsung:</p> <div class="border border-black p-2 min-h-[75px] text-xs font-serif text-slate-500 rounded"><span class="print:hidden">( Kosongkan jika pelaksanaan ujian berjalan tertib dan lancar )</span></div></div> <p class="mb-3">Demikian Berita Acara ini dibuat dengan sesungguhnya untuk dipergunakan sebagaimana mestinya.</p> <div class="mt-4 text-sm font-serif">`);
        if (activeOfficers.length <= 1) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="grid grid-cols-2 gap-4 text-center"><div><div class="h-5"></div> <p class="font-medium mb-12">Kepala Madrasah,</p> <p class="border-b border-black font-bold inline-block px-3">${escape_html(school?.principal_name || "( .................................... )")}</p> <p class="text-xs mt-1">NIP. ${escape_html(school?.principal_nip || "..............................")}</p></div> <div><p class="text-xs text-slate-700 mb-0.5">${escape_html(locationCity)}, ${escape_html(formatDateFull(effectiveStart))}</p> <p class="font-medium mb-12">${escape_html(activeOfficers[0]?.role === "Pengawas I" ? "Pengawas Ruang" : activeOfficers[0]?.role || "Pengawas Ruang")},</p> <p class="border-b border-black font-bold inline-block px-3">${escape_html(activeOfficers[0]?.data?.name || "( .................................... )")}</p> <p class="text-xs mt-1">NIP. ${escape_html(activeOfficers[0]?.data?.nip || "..............................")}</p></div></div>`);
        } else if (activeOfficers.length === 2) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<div class="grid grid-cols-2 gap-4 text-center"><div><div class="h-5"></div> <p class="font-medium mb-12">${escape_html(activeOfficers[0].role)},</p> <p class="border-b border-black font-bold inline-block px-3">${escape_html(activeOfficers[0].data?.name || "( .................................... )")}</p> <p class="text-xs mt-1">NIP. ${escape_html(activeOfficers[0].data?.nip || "..............................")}</p></div> <div><p class="text-xs text-slate-700 mb-0.5">${escape_html(locationCity)}, ${escape_html(formatDateFull(effectiveStart))}</p> <p class="font-medium mb-12">${escape_html(activeOfficers[1].role)},</p> <p class="border-b border-black font-bold inline-block px-3">${escape_html(activeOfficers[1].data?.name || "( .................................... )")}</p> <p class="text-xs mt-1">NIP. ${escape_html(activeOfficers[1].data?.nip || "..............................")}</p></div> <div></div> <div class="mt-2"><p class="font-medium mb-12">Kepala Madrasah,</p> <p class="border-b border-black font-bold inline-block px-3">${escape_html(school?.principal_name || "( .................................... )")}</p> <p class="text-xs mt-1">NIP. ${escape_html(school?.principal_nip || "..............................")}</p></div></div>`);
        } else if (activeOfficers.length === 3) {
          $$renderer2.push("<!--[2-->");
          $$renderer2.push(`<div class="grid grid-cols-2 gap-4 text-center"><div><div class="h-5"></div> <p class="font-medium mb-12">${escape_html(activeOfficers[0].role)},</p> <p class="border-b border-black font-bold inline-block px-3">${escape_html(activeOfficers[0].data?.name || "( .................................... )")}</p> <p class="text-xs mt-1">NIP. ${escape_html(activeOfficers[0].data?.nip || "..............................")}</p></div> <div><p class="text-xs text-slate-700 mb-0.5">${escape_html(locationCity)}, ${escape_html(formatDateFull(effectiveStart))}</p> <p class="font-medium mb-12">${escape_html(activeOfficers[1].role)},</p> <p class="border-b border-black font-bold inline-block px-3">${escape_html(activeOfficers[1].data?.name || "( .................................... )")}</p> <p class="text-xs mt-1">NIP. ${escape_html(activeOfficers[1].data?.nip || "..............................")}</p></div> <div class="mt-2"><p class="font-medium mb-12">${escape_html(activeOfficers[2].role)},</p> <p class="border-b border-black font-bold inline-block px-3">${escape_html(activeOfficers[2].data?.name || "( .................................... )")}</p> <p class="text-xs mt-1">NIP. ${escape_html(activeOfficers[2].data?.nip || "..............................")}</p></div> <div class="mt-2"><p class="font-medium mb-12">Kepala Madrasah,</p> <p class="border-b border-black font-bold inline-block px-3">${escape_html(school?.principal_name || "( .................................... )")}</p> <p class="text-xs mt-1">NIP. ${escape_html(school?.principal_nip || "..............................")}</p></div></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="grid grid-cols-2 gap-4 text-center"><div><div class="h-5"></div> <p class="font-medium mb-12">${escape_html(activeOfficers[0].role)},</p> <p class="border-b border-black font-bold inline-block px-3">${escape_html(activeOfficers[0].data?.name || "( .................................... )")}</p> <p class="text-xs mt-1">NIP. ${escape_html(activeOfficers[0].data?.nip || "..............................")}</p></div> <div><p class="text-xs text-slate-700 mb-0.5">${escape_html(locationCity)}, ${escape_html(formatDateFull(effectiveStart))}</p> <p class="font-medium mb-12">${escape_html(activeOfficers[1].role)},</p> <p class="border-b border-black font-bold inline-block px-3">${escape_html(activeOfficers[1].data?.name || "( .................................... )")}</p> <p class="text-xs mt-1">NIP. ${escape_html(activeOfficers[1].data?.nip || "..............................")}</p></div> <div class="mt-2"><p class="font-medium mb-12">${escape_html(activeOfficers[2].role)},</p> <p class="border-b border-black font-bold inline-block px-3">${escape_html(activeOfficers[2].data?.name || "( .................................... )")}</p> <p class="text-xs mt-1">NIP. ${escape_html(activeOfficers[2].data?.nip || "..............................")}</p></div> <div class="mt-2"><p class="font-medium mb-12">${escape_html(activeOfficers[3].role)},</p> <p class="border-b border-black font-bold inline-block px-3">${escape_html(activeOfficers[3].data?.name || "( .................................... )")}</p> <p class="text-xs mt-1">NIP. ${escape_html(activeOfficers[3].data?.nip || "..............................")}</p></div> <div></div> <div class="mt-2"><p class="font-medium mb-12">Kepala Madrasah,</p> <p class="border-b border-black font-bold inline-block px-3">${escape_html(school?.principal_name || "( .................................... )")}</p> <p class="text-xs mt-1">NIP. ${escape_html(school?.principal_nip || "..............................")}</p></div></div>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
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
