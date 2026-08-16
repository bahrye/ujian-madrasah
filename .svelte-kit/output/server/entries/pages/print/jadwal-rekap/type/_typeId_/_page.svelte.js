import { h as head, j as attr_class, e as escape_html, k as attr, i as ensure_array_like, f as bind_props } from "../../../../../../chunks/index.js";
import { p as parseDate } from "../../../../../../chunks/date.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let school, examType, classData, schedules, days, proctorMap, totalExams, locationStr;
    let data = $$props["data"];
    function formatOnlyTime(dateStr) {
      if (!dateStr) return "--.--";
      const date = parseDate(dateStr);
      if (isNaN(date.getTime())) return "--.--";
      return new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(date).replace(":", ".");
    }
    function formatDateToday() {
      const today = /* @__PURE__ */ new Date();
      return today.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    }
    function getProctorNumbers(namesStr, map) {
      if (!namesStr) return "-";
      const names = namesStr.split("||").map((n) => n.trim()).filter(Boolean);
      if (names.length === 0) return "-";
      const numbers = names.map((n) => map.get(n)).filter(Boolean).sort((a, b) => (a || 0) - (b || 0));
      return numbers.length > 0 ? numbers.join(" & ") : "-";
    }
    school = data.school;
    examType = data.examType;
    classData = data.classData;
    schedules = data.schedules || [];
    ({ days, proctorMap, totalExams } = (() => {
      const daysList = [];
      const map = /* @__PURE__ */ new Map();
      let proctorCounter = 1;
      let total = 0;
      let currentDateStr = "";
      let currentGroup = null;
      schedules.forEach((exam) => {
        if (exam.proctor_names) {
          exam.proctor_names.split("||").forEach((p) => {
            const name = p.trim();
            if (name && !map.has(name)) {
              map.set(name, proctorCounter++);
            }
          });
        }
        if (!exam.start_time) return;
        const date = parseDate(String(exam.start_time));
        const dateFormatted = new Intl.DateTimeFormat("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(date);
        if (dateFormatted !== currentDateStr) {
          currentDateStr = dateFormatted;
          currentGroup = { dateStr: dateFormatted, exams: [] };
          daysList.push(currentGroup);
        }
        currentGroup?.exams.push(exam);
        total++;
      });
      return { days: daysList, proctorMap: map, totalExams: total };
    })());
    locationStr = [
      school?.district ? `Kecamatan ${school.district}` : "",
      school?.city ? school.city.toLowerCase().startsWith("kab") || school.city.toLowerCase().startsWith("kota") ? school.city : `Kabupaten ${school.city}` : "",
      school?.province ? school.province : ""
    ].filter(Boolean).join(", ");
    head("1dz6e4z", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Cetak Jadwal Ujian - ${escape_html(examType.name)}</title>`);
      });
      $$renderer3.push(`<style>
		@media print {
			@page {
				size: {orientation === 'landscape' ? 'A4 landscape' : 'A4 portrait'};
				margin: 1cm;
			}
		}
	</style>`);
    });
    $$renderer2.push(`<div class="no-print p-4 bg-slate-800 text-white border-b border-slate-700 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-md svelte-1dz6e4z"><div class="flex items-center gap-3"><span class="text-xs text-slate-300 font-medium">Orientasi Cetak:</span> <div class="inline-flex rounded-lg bg-slate-700 p-1 border border-slate-600"><button type="button"${attr_class(`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${"bg-indigo-600 text-white shadow-sm"}`)}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="5" y="3" width="14" height="18" rx="2"></rect></svg> Potrait (Tegak)</button> <button type="button"${attr_class(`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${"text-slate-300 hover:text-white"}`)}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"></rect></svg> Lansekap (Mendatar)</button></div></div> <div class="flex items-center gap-2"><button class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium transition-colors">Tutup</button> <button class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak Jadwal</button></div></div> <div${attr_class(
      `p-4 md:p-8 print:p-0 print:m-0 mx-auto bg-white transition-all ${"max-w-[21cm] mode-portrait"}`,
      "svelte-1dz6e4z"
    )} style="font-family: 'Times New Roman', Times, Arial, serif; font-variant-numeric: lining-nums tabular-nums;"><div class="flex items-center justify-between gap-4 pb-2 relative"><img src="/kemenag.png" alt="Logo Kemenag" class="w-20 h-20 object-contain shrink-0"/> <div class="flex-1 text-center font-serif px-2"><h4 class="font-semibold text-sm uppercase tracking-wider text-black m-0 leading-tight">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h4> <h3 class="font-bold text-xl uppercase tracking-wide text-black m-0 my-0.5">${escape_html(school?.name || "NAMA SEKOLAH")}</h3> `);
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
    $$renderer2.push(`<!--]--></div> <div class="mt-2 mb-5"><div style="border-bottom: 1px solid #000;"></div> <div style="border-bottom: 2.5px solid #000; margin-top: 2px;"></div></div> <div class="text-center mb-6 font-serif"><h2 class="font-bold text-lg uppercase underline tracking-wider m-0">JADWAL ${escape_html(examType.name)}</h2> `);
    if (classData) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-sm font-bold uppercase mt-1">KELAS: ${escape_html(classData.name)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (days.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-12 text-center text-slate-500 italic border border-black">Belum ada jadwal ujian untuk ditampilkan.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="w-full"><table${attr_class(`w-full border-collapse border-2 border-black whitespace-nowrap ${"text-xs"}`)}><thead><tr class="bg-gray-100 text-black font-bold"><th${attr_class(`border-2 border-black ${"px-1.5 py-1.5 w-8"} text-center uppercase`)}>NO</th><th${attr_class(`border-2 border-black ${"px-2 py-1.5 w-36"} text-center uppercase`)}>HARI, TANGGAL</th><th${attr_class(`border-2 border-black ${"px-1.5 py-1.5 w-12"} text-center uppercase`)}>JAM KE</th><th${attr_class(`border-2 border-black ${"px-2 py-1.5 w-28"} text-center uppercase`)}>WAKTU</th><th${attr_class(`border-2 border-black ${"px-2 py-1.5"} text-center uppercase`)}>MATA PELAJARAN</th><th${attr_class(`border-2 border-black ${"px-1.5 py-1.5 w-20"} text-center uppercase`)}>PENGAWAS</th><th${attr_class(`border-2 border-black ${"px-2 py-1.5 w-36 whitespace-normal"} text-left uppercase`)}>DAFTAR PENGAWAS</th></tr></thead><tbody><!--[-->`);
      const each_array = ensure_array_like(days);
      for (let gIdx = 0, $$length = each_array.length; gIdx < $$length; gIdx++) {
        let group = each_array[gIdx];
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(group.exams);
        for (let eIdx = 0, $$length2 = each_array_1.length; eIdx < $$length2; eIdx++) {
          let exam = each_array_1[eIdx];
          $$renderer2.push(`<tr class="bg-white text-black">`);
          if (eIdx === 0) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<td${attr_class(`border-2 border-black ${"px-1.5 py-1.5"} text-center align-middle`)}${attr("rowspan", group.exams.length)}>${escape_html(gIdx + 1)}</td> <td${attr_class(`border-2 border-black ${"px-2 py-1.5"} text-center align-middle font-medium`)}${attr("rowspan", group.exams.length)}>${escape_html(group.dateStr)}</td>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--><td${attr_class(`border-2 border-black ${"px-1.5 py-1.5"} text-center`)}>${escape_html(eIdx + 1)}</td><td${attr_class(`border-2 border-black ${"px-2 py-1.5"} text-center tracking-wider`)}>${escape_html(formatOnlyTime(exam.start_time || ""))} - ${escape_html(formatOnlyTime(exam.end_time || ""))}</td><td${attr_class(`border-2 border-black ${"px-2 py-1.5"} text-center font-medium`)}>${escape_html(exam.subject_name || exam.title || "")}</td><td${attr_class(`border-2 border-black ${"px-1.5 py-1.5"} text-center font-semibold`)}>${escape_html(getProctorNumbers(exam.proctor_names || "", proctorMap))}</td>`);
          if (gIdx === 0 && eIdx === 0) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<td${attr_class(`border-2 border-black ${"px-2 py-1.5 whitespace-normal"} align-top bg-white`)}${attr("rowspan", totalExams)}><div${attr_class(`space-y-1 text-xs ${"whitespace-normal max-w-[160px] sm:max-w-[200px]"}`)}><!--[-->`);
            const each_array_2 = ensure_array_like(Array.from(proctorMap.entries()));
            for (let $$index = 0, $$length3 = each_array_2.length; $$index < $$length3; $$index++) {
              let [name, num] = each_array_2[$$index];
              $$renderer2.push(`<div class="leading-tight flex items-start gap-1"><span class="font-bold shrink-0">${escape_html(num)}.</span> <span${attr_class(`font-normal ${"whitespace-normal break-words"}`)}>${escape_html(name)}</span></div>`);
            }
            $$renderer2.push(`<!--]--> `);
            if (proctorMap.size === 0) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<span class="italic text-gray-400">-</span>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]--></div></td>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></tr>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div>`);
    }
    $$renderer2.push(`<!--]--> <div class="mt-10 flex justify-end"><div class="text-center text-sm min-w-[220px]"><p class="mb-1">${escape_html(school?.city ? school.city.toLowerCase().startsWith("kab") || school.city.toLowerCase().startsWith("kota") ? school.city : `Kab. ${school.city}` : "Madrasah")}, ${escape_html(formatDateToday())}</p> <p class="mb-14 font-medium">Panitia Ujian,</p> <p class="font-bold border-b border-black w-full mb-0.5 px-2">${escape_html(data.committeeName || "......................................")}</p> <p class="text-xs">NIP. ${escape_html(data.committeeNip || "..............................")}</p></div></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
