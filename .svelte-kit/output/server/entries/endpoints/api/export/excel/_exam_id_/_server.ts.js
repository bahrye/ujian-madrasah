import { error } from "@sveltejs/kit";
import { g as getDB } from "../../../../../../chunks/db.js";
import * as XLSX from "xlsx";
import { p as parseDate } from "../../../../../../chunks/date.js";
const GET = async ({ params, platform, locals }) => {
  if (!locals.user || !["superadmin", "admin", "guru", "panitia"].includes(locals.user.role)) {
    throw error(401, "Unauthorized");
  }
  const db = getDB(platform);
  const examId = parseInt(params.exam_id, 10);
  if (isNaN(examId)) throw error(400, "Invalid Exam ID");
  const exam = await db.prepare("SELECT e.*, s.name as subject_name FROM exams e LEFT JOIN subjects s ON e.subject_id = s.id WHERE e.id = ? AND e.school_id = ?").bind(examId, locals.user.school_id).first();
  if (!exam) throw error(404, "Ujian tidak ditemukan");
  const results = await db.prepare(`
		SELECT 
			u.username as nisn,
			u.name as student_name, 
			c.name as class_name,
			sa.status,
			sa.score,
			sa.total_points,
			sa.start_time,
			sa.end_time,
			sa.violation_count
		FROM exam_participants p
		JOIN users u ON p.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		LEFT JOIN student_attempts sa ON sa.student_id = p.student_id AND sa.exam_id = p.exam_id
		WHERE p.exam_id = ?
		ORDER BY c.name, u.name
	`).bind(examId).all();
  const dataForExcel = results.results.map((row, index) => {
    let statusLabel = "Belum Mengerjakan";
    if (row.status === "selesai") statusLabel = "Selesai";
    else if (row.status === "mengerjakan") statusLabel = "Sedang Mengerjakan";
    else if (row.status === "waktu_habis") statusLabel = "Waktu Habis";
    const startTimeStr = row.start_time ? parseDate(row.start_time).toLocaleString("id-ID") : "-";
    const endTimeStr = row.end_time ? parseDate(row.end_time).toLocaleString("id-ID") : "-";
    return {
      "No": index + 1,
      "NISN/Username": row.nisn,
      "Nama Siswa": row.student_name,
      "Kelas": row.class_name || "-",
      "Status Ujian": statusLabel,
      "Waktu Mulai": startTimeStr,
      "Waktu Selesai": endTimeStr,
      "Pelanggaran": row.violation_count || 0,
      "Nilai Akhir": row.score != null ? row.score : row.status ? "Sedang dihitung" : "-"
    };
  });
  const wb = XLSX.utils.book_new();
  const wsData = [
    [`REKAPITULASI NILAI UJIAN: ${exam.title.toUpperCase()}`],
    [`Mata Pelajaran: ${exam.subject_name || "Umum"}`],
    []
    // Empty row
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.sheet_add_json(ws, dataForExcel, { origin: "A4" });
  ws["!cols"] = [
    { wch: 5 },
    // No
    { wch: 15 },
    // NISN
    { wch: 30 },
    // Nama Siswa
    { wch: 15 },
    // Kelas
    { wch: 20 },
    // Status Ujian
    { wch: 20 },
    // Waktu Mulai
    { wch: 20 },
    // Waktu Selesai
    { wch: 15 },
    // Pelanggaran
    { wch: 15 }
    // Nilai Akhir
  ];
  XLSX.utils.book_append_sheet(wb, ws, "Rekap Nilai");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  const safeTitle = exam.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const filename = `Nilai_${safeTitle}.xlsx`;
  return new Response(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`
    }
  });
};
export {
  GET
};
