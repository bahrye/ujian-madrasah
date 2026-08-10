import { g as getDB } from "../../../../../../chunks/db.js";
import { error } from "@sveltejs/kit";
const load = async ({ platform, params, locals, url }) => {
  const db = getDB(platform);
  const typeIdStr = params.typeId;
  const typeId = parseInt(typeIdStr, 10);
  if (isNaN(typeId)) throw error(400, "ID Tipe Ujian tidak valid");
  const school = await db.prepare("SELECT * FROM schools WHERE id = ?").bind(locals.user.school_id).first();
  const examType = await db.prepare("SELECT * FROM exam_types WHERE id = ? AND school_id = ?").bind(typeId, locals.user.school_id).first();
  if (!examType) throw error(404, "Tipe Ujian tidak ditemukan");
  const classIdStr = url.searchParams.get("class_id");
  const classId = parseInt(classIdStr || "", 10);
  let query = `
		SELECT u.id as user_id, u.name as student_name, u.username, u.nisn, u.nomor_peserta, u.photo, u.place_of_birth, u.date_of_birth, c.name as class_name
		FROM users u
		JOIN classes c ON u.class_id = c.id
		JOIN exam_type_classes etc ON etc.class_id = u.class_id
		WHERE u.school_id = ? AND u.role = 'siswa' AND u.is_active = 1 AND etc.exam_type_id = ?
	`;
  let paramsArr = [locals.user.school_id, typeId];
  if (!isNaN(classId)) {
    query += ` AND u.class_id = ?`;
    paramsArr.push(classId);
  }
  query += ` ORDER BY c.name, u.name`;
  const participants = await db.prepare(query).bind(...paramsArr).all();
  const formattedParticipants = participants.results.map((p) => {
    const isNomorPesertaMode = p.username === p.nomor_peserta;
    return {
      ...p,
      login_username: p.username,
      login_password: p.nisn,
      // Password is always NISN in this system
      login_mode_label: isNomorPesertaMode ? "No. Peserta" : "NISN",
      display_nisn: p.nisn,
      display_nomor_peserta: p.nomor_peserta || "-"
    };
  });
  return {
    school,
    examType,
    participants: formattedParticipants
  };
};
export {
  load
};
