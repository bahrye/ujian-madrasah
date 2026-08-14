import { h as head, i as ensure_array_like, e as escape_html, j as attr_class, l as clsx, k as attr, f as bind_props } from "../../../../../chunks/index.js";
import { p as parseDate } from "../../../../../chunks/date.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let school, exam, participantsGrouped, isNomorPesertaMode, sessionMap, proctorOptions, proctor1, proctor2;
    let data = $$props["data"];
    let proctor1Id = data.defaultProctor1Id || (proctorOptions[0]?.id || "");
    let proctor2Id = data.defaultProctor2Id || "";
    function formatDate(dateStr) {
      if (!dateStr || dateStr === "-") return "......................";
      const date = parseDate(dateStr);
      if (isNaN(date.getTime())) return "......................";
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
    function formatTime(timeStr) {
      if (!timeStr) return "....";
      if (timeStr.length <= 5) return timeStr;
      if (timeStr.includes("T")) return timeStr.split("T")[1].slice(0, 5);
      if (timeStr.includes(" ")) return timeStr.split(" ")[1].slice(0, 5);
      return timeStr.slice(0, 5);
    }
    school = data.school;
    exam = data.exam;
    participantsGrouped = data.participantsGrouped;
    isNomorPesertaMode = data.isNomorPesertaMode;
    sessionMap = data.sessionMap;
    proctorOptions = data.proctorOptions || [];
    proctor1 = proctorOptions.find((p) => String(p.id) === String(proctor1Id));
    proctor2 = proctorOptions.find((p) => String(p.id) === String(proctor2Id));
    head("5lujtk", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Daftar Hadir Ujian - ${escape_html(exam.title)}</title>`);
      });
    });
    $$renderer2.push(`<div class="no-print p-4 bg-slate-800 text-white border-b border-slate-700 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-md svelte-5lujtk"><div class="flex items-center gap-4 flex-wrap"><span class="text-xs font-semibold uppercase tracking-wider text-slate-300">Pengaturan Pengawas:</span> <div class="flex items-center gap-2"><label for="p1-select" class="text-xs text-slate-300 font-medium">Pengawas 1:</label> `);
    $$renderer2.select(
      {
        id: "p1-select",
        value: proctor1Id,
        class: "bg-slate-700 text-white text-xs border border-slate-600 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-400"
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
            $$renderer4.push(`${escape_html(p.name)} ${escape_html(p.nip ? `(NIP. ${p.nip})` : "")}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <div class="flex items-center gap-2"><label for="p2-select" class="text-xs text-slate-300 font-medium">Pengawas 2:</label> `);
    $$renderer2.select(
      {
        id: "p2-select",
        value: proctor2Id,
        class: "bg-slate-700 text-white text-xs border border-slate-600 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-400"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`-- Tidak Ada / Kosongkan --`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(proctorOptions);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let p = each_array_1[$$index_1];
          $$renderer3.option({ value: p.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(p.name)} ${escape_html(p.nip ? `(NIP. ${p.nip})` : "")}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div></div> <div class="flex items-center gap-2"><button class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium transition-colors">Tutup</button> <button class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak Daftar Hadir</button></div></div> <div class="p-8 print:p-8 max-w-[21cm] mx-auto bg-white"><!--[-->`);
    const each_array_2 = ensure_array_like(Object.entries(participantsGrouped));
    for (let roomIdx = 0, $$length = each_array_2.length; roomIdx < $$length; roomIdx++) {
      let [roomName, sessionsDict] = each_array_2[roomIdx];
      $$renderer2.push(`<!--[-->`);
      const each_array_3 = ensure_array_like(Object.entries(sessionsDict));
      for (let sessionIdx = 0, $$length2 = each_array_3.length; sessionIdx < $$length2; sessionIdx++) {
        let [sessionNumStr, students] = each_array_3[sessionIdx];
        const sessionNum = parseInt(sessionNumStr);
        const sessionData = sessionMap?.[sessionNum];
        const effectiveStart = sessionData?.start_time || exam.start_time;
        const effectiveEnd = sessionData?.end_time || exam.end_time;
        const effectiveDateStr = effectiveStart && effectiveStart.includes("-") ? effectiveStart : exam.start_time;
        const classNames = Array.from(new Set(students.map((s) => s.class_name).filter(Boolean))).join(", ") || "-";
        const locationStr = [
          school?.district ? `Kecamatan ${school.district}` : "",
          school?.city ? school.city.toLowerCase().startsWith("kab") || school.city.toLowerCase().startsWith("kota") ? school.city : `Kabupaten ${school.city}` : "",
          school?.province ? school.province : ""
        ].filter(Boolean).join(", ");
        $$renderer2.push(`<div${attr_class(clsx(roomIdx > 0 || sessionIdx > 0 ? "break-before-page pt-8" : ""), "svelte-5lujtk")}><div class="flex items-center justify-between gap-4 pb-3 mb-5 relative" style="border-bottom: 3px double #000;"><img src="/kemenag.png" alt="Logo Kemenag" class="w-20 h-20 object-contain shrink-0"/> <div class="flex-1 text-center font-serif px-2"><h4 class="font-semibold text-sm uppercase tracking-wider text-black m-0 leading-tight">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h4> <h3 class="font-bold text-xl uppercase tracking-wide text-black m-0 my-0.5">${escape_html(school?.name || "NAMA SEKOLAH")}</h3> `);
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
        $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-2 gap-4 mb-4 text-sm"><table class="w-full"><tbody><tr><td class="py-1 w-32 font-medium">Ujian</td><td class="w-4">:</td><td>${escape_html(exam.exam_type_name || exam.title)}</td></tr><tr><td class="py-1 font-medium">Mata Pelajaran</td><td>:</td><td>${escape_html(exam.subject_name || "Umum")}</td></tr><tr><td class="py-1 font-medium">Kelas</td><td>:</td><td>${escape_html(classNames)}</td></tr></tbody></table> <table class="w-full"><tbody><tr><td class="py-1 w-32 font-medium">Hari, Tanggal</td><td class="w-4">:</td><td>${escape_html(formatDate(effectiveDateStr))}</td></tr><tr><td class="py-1 font-medium">Waktu</td><td>:</td><td>${escape_html(formatTime(effectiveStart))} - ${escape_html(formatTime(effectiveEnd))}</td></tr>`);
        if (data.hasSessions) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<tr><td class="py-1 font-medium">Ruang / Sesi</td><td>:</td><td>${escape_html(roomName)} / Sesi ${escape_html(sessionNum)}</td></tr>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<tr><td class="py-1 font-medium">Ruang</td><td>:</td><td>${escape_html(roomName)}</td></tr>`);
        }
        $$renderer2.push(`<!--]--></tbody></table></div> <table class="w-full border-collapse border border-black mb-6 text-sm"><thead><tr><th class="border border-black p-2 w-12 text-center">No</th><th class="border border-black p-2 px-4 whitespace-nowrap">${escape_html(isNomorPesertaMode ? "No. Peserta" : "NISN")}</th><th class="border border-black p-2 text-left">Nama Peserta</th><th class="border border-black p-2 w-48 text-center" colspan="2">Tanda Tangan</th><th class="border border-black p-2 w-24 text-center">Ket.</th></tr></thead><tbody><!--[-->`);
        const each_array_4 = ensure_array_like(students);
        for (let i = 0, $$length3 = each_array_4.length; i < $$length3; i++) {
          let p = each_array_4[i];
          $$renderer2.push(`<tr><td class="border border-black p-2 text-center">${escape_html(i + 1)}</td><td class="border border-black p-2 text-center font-mono whitespace-nowrap text-[11px] leading-tight">${escape_html(isNomorPesertaMode ? p.nomor_peserta || "-" : p.nisn || p.username)}</td><td class="border border-black p-2">${escape_html(p.student_name)}</td><td class="border-b border-black p-2 w-24 align-top h-12 relative text-center">`);
          if ((i + 1) % 2 !== 0) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="text-xs text-slate-500 text-left absolute top-1 left-1 z-10">${escape_html(i + 1)}.</span> `);
            if (p.signature) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<img${attr("src", p.signature)} alt="TTD" class="absolute inset-1 w-[90%] h-[90%] object-contain z-0 opacity-80 mix-blend-multiply"/>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]-->`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></td><td class="border-b border-r border-black p-2 w-24 align-top h-12 relative text-center">`);
          if ((i + 1) % 2 === 0) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="text-xs text-slate-500 text-left absolute top-1 left-1 z-10">${escape_html(i + 1)}.</span> `);
            if (p.signature) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<img${attr("src", p.signature)} alt="TTD" class="absolute inset-1 w-[90%] h-[90%] object-contain z-0 opacity-80 mix-blend-multiply"/>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]-->`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></td><td class="border border-black p-2 text-center text-xs"></td></tr>`);
        }
        $$renderer2.push(`<!--]--></tbody></table> <div class="mb-4 text-xs text-slate-700"><p class="font-medium mb-0.5">Keterangan:</p> <ol class="list-decimal pl-4 space-y-0.5"><li>Daftar Hadir dibuat rangkap 2 (dua), masing-masing untuk Panitia dan Sekolah.</li> <li>Pengawas ruang menyilangkan nama peserta yang tidak hadir.</li></ol></div> `);
        if (proctor1 && proctor2 && String(proctor1.id) !== String(proctor2.id)) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="grid grid-cols-2 gap-8 text-sm pt-2"><div class="text-center"><p class="mb-14 font-medium">Pengawas I,</p> <p class="border-b border-black font-bold inline-block px-4">${escape_html(proctor1.name)}</p> <p class="text-xs mt-1">NIP. ${escape_html(proctor1.nip || "..............................")}</p></div> <div class="text-center"><p class="mb-14 font-medium">Pengawas II,</p> <p class="border-b border-black font-bold inline-block px-4">${escape_html(proctor2.name)}</p> <p class="text-xs mt-1">NIP. ${escape_html(proctor2.nip || "..............................")}</p></div></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="flex justify-end text-sm pt-2"><div class="w-60 text-center"><p class="mb-14 font-medium">Pengawas Ruang,</p> <p class="border-b border-black font-bold inline-block px-2">${escape_html(proctor1?.name || "( .................................... )")}</p> <p class="text-xs mt-1">NIP. ${escape_html(proctor1?.nip || "..............................")}</p></div></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
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
