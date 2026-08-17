import { fail, redirect } from "@sveltejs/kit";
import { g as getDB, e as ensureUserLoginColumns } from "../../../../chunks/db.js";
const load = async ({ platform, locals, url }) => {
  if (!locals.user) throw redirect(302, "/login");
  if (!["pengawas", "guru", "admin", "superadmin", "panitia"].includes(locals.user.role)) {
    throw redirect(302, "/");
  }
  try {
    const db = getDB(platform);
    await ensureUserLoginColumns(db);
    const userSchoolId = locals.user.school_id;
    const isSuperAdmin = locals.user.role === "superadmin" || userSchoolId === null;
    const search = url.searchParams.get("q")?.trim() || "";
    const examFilterStr = url.searchParams.get("exam_id") || "";
    const examFilter = parseInt(examFilterStr, 10);
    const sessionFilterStr = url.searchParams.get("session_number") || "";
    const sessionFilter = parseInt(sessionFilterStr, 10);
    const roomFilterStr = url.searchParams.get("room_id") || "";
    const roomFilter = parseInt(roomFilterStr, 10);
    const classFilterStr = url.searchParams.get("class_id") || "";
    const classFilter = parseInt(classFilterStr, 10);
    const statusFilter = url.searchParams.get("status") || "";
    const scopeFilter = url.searchParams.get("scope") || "all";
    const examsQuery = isSuperAdmin ? `SELECT e.id, e.title FROM exams e ORDER BY e.is_active DESC, e.title ASC` : `SELECT e.id, e.title FROM exams e WHERE e.school_id = ? ORDER BY e.is_active DESC, e.title ASC`;
    const examsParams = isSuperAdmin ? [] : [userSchoolId];
    const examsRes = await db.prepare(examsQuery).bind(...examsParams).all();
    const exams = examsRes.results || [];
    const classesQuery = isSuperAdmin ? `SELECT id, name FROM classes ORDER BY name ASC` : `SELECT id, name FROM classes WHERE school_id = ? ORDER BY name ASC`;
    const classesParams = isSuperAdmin ? [] : [userSchoolId];
    const classesRes = await db.prepare(classesQuery).bind(...classesParams).all();
    const roomsQuery = isSuperAdmin ? `SELECT id, name FROM exam_rooms WHERE is_active = 1 ORDER BY name ASC` : `SELECT id, name FROM exam_rooms WHERE school_id = ? AND is_active = 1 ORDER BY name ASC`;
    const roomsParams = isSuperAdmin ? [] : [userSchoolId];
    const roomsRes = await db.prepare(roomsQuery).bind(...roomsParams).all();
    let query = `
			SELECT DISTINCT
				u.id,
				u.name,
				u.username,
				u.nisn,
				COALESCE(u.session_number, 1) as student_session_number,
				COALESCE(c.name, '-') as class_name,
				(
					SELECT er.name 
					FROM exam_participants ep 
					JOIN exam_rooms er ON ep.room_id = er.id 
					WHERE ep.student_id = u.id 
					LIMIT 1
				) as room_name,
				(
					SELECT e.title 
					FROM exam_participants ep 
					JOIN exams e ON ep.exam_id = e.id 
					WHERE ep.student_id = u.id AND e.is_active = 1
					LIMIT 1
				) as exam_title,
				COALESCE(u.is_logged_in, 0) as is_logged_in,
				u.last_active_at,
				u.login_device
			FROM users u
			LEFT JOIN classes c ON u.class_id = c.id
			WHERE u.role = 'siswa' AND u.is_active = 1
		`;
    const params = [];
    if (!isSuperAdmin) {
      query += ` AND (u.school_id = ? OR u.id IN (
				SELECT epart.student_id
				FROM exam_participants epart
				JOIN exams e ON epart.exam_id = e.id
				JOIN exam_proctors ep ON e.id = ep.exam_id
				WHERE ep.proctor_id = ?
			))`;
      params.push(userSchoolId, locals.user.id);
    }
    if (scopeFilter === "proctored" && ["pengawas", "guru"].includes(locals.user.role)) {
      query += `
				AND u.id IN (
					SELECT epart.student_id
					FROM exam_participants epart
					JOIN exams e ON epart.exam_id = e.id
					JOIN exam_proctors ep ON e.id = ep.exam_id
					WHERE ep.proctor_id = ?
					  AND (ep.room_id IS NULL OR ep.room_id = epart.room_id)
				)
			`;
      params.push(locals.user.id);
    }
    if (!isNaN(examFilter)) {
      query += `
				AND u.id IN (
					SELECT student_id FROM exam_participants WHERE exam_id = ?
				)
			`;
      params.push(examFilter);
    }
    if (!isNaN(sessionFilter)) {
      query += ` AND COALESCE(u.session_number, 1) = ?`;
      params.push(sessionFilter);
    }
    if (!isNaN(roomFilter)) {
      query += `
				AND u.id IN (
					SELECT student_id FROM exam_participants WHERE room_id = ?
				)
			`;
      params.push(roomFilter);
    }
    if (!isNaN(classFilter)) {
      query += ` AND u.class_id = ?`;
      params.push(classFilter);
    }
    if (search) {
      query += ` AND (u.name LIKE ? OR u.username LIKE ? OR u.nisn LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (statusFilter === "active") {
      query += ` AND COALESCE(u.is_logged_in, 0) = 1`;
    } else if (statusFilter === "offline") {
      query += ` AND COALESCE(u.is_logged_in, 0) = 0`;
    }
    query += ` ORDER BY COALESCE(u.is_logged_in, 0) DESC, u.name ASC`;
    const result = await db.prepare(query).bind(...params).all();
    let students = result.results || [];
    if (students.length === 0 && !search && isNaN(examFilter) && isNaN(roomFilter) && isNaN(classFilter) && !statusFilter) {
      const fallbackResult = await db.prepare(`
				SELECT DISTINCT
					u.id,
					u.name,
					u.username,
					u.nisn,
					COALESCE(u.session_number, 1) as student_session_number,
					COALESCE(c.name, '-') as class_name,
					(
						SELECT er.name 
						FROM exam_participants ep 
						JOIN exam_rooms er ON ep.room_id = er.id 
						WHERE ep.student_id = u.id 
						LIMIT 1
					) as room_name,
					'-' as exam_title,
					COALESCE(u.is_logged_in, 0) as is_logged_in,
					u.last_active_at,
					u.login_device
				FROM users u
				LEFT JOIN classes c ON u.class_id = c.id
				WHERE u.role = 'siswa' AND u.is_active = 1
				ORDER BY COALESCE(u.is_logged_in, 0) DESC, u.name ASC
			`).all();
      students = fallbackResult.results || [];
    }
    const activeCount = students.filter((s) => s.is_logged_in === 1).length;
    const offlineCount = students.filter((s) => s.is_logged_in === 0).length;
    return {
      students,
      exams,
      classes: classesRes.results || [],
      rooms: roomsRes.results || [],
      stats: {
        total: students.length,
        active: activeCount,
        offline: offlineCount
      },
      filters: {
        q: search,
        exam_id: isNaN(examFilter) ? "" : String(examFilter),
        session_number: isNaN(sessionFilter) ? "" : String(sessionFilter),
        room_id: isNaN(roomFilter) ? "" : String(roomFilter),
        class_id: isNaN(classFilter) ? "" : String(classFilter),
        status: statusFilter,
        scope: scopeFilter
      }
    };
  } catch (e) {
    console.error("Error loading Reset Login page:", e);
    return {
      students: [],
      exams: [],
      classes: [],
      rooms: [],
      stats: { total: 0, active: 0, offline: 0 },
      filters: { q: "", exam_id: "", session_number: "", room_id: "", class_id: "", status: "", scope: "all" },
      error: e.message || String(e)
    };
  }
};
const actions = {
  resetLogin: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const formData = await request.formData();
    const studentIdStr = formData.get("student_id")?.toString();
    const studentId = parseInt(studentIdStr || "", 10);
    if (isNaN(studentId)) {
      return fail(400, { error: "ID Siswa tidak valid." });
    }
    try {
      await ensureUserLoginColumns(db);
      const student = await db.prepare("SELECT name FROM users WHERE id = ? AND role = 'siswa'").bind(studentId).first();
      if (!student) {
        return fail(404, { error: "Data siswa tidak ditemukan." });
      }
      await db.prepare(`
				UPDATE users 
				SET is_logged_in = 0, session_token = NULL 
				WHERE id = ?
			`).bind(studentId).run();
      return { success: `Login siswa "${student.name}" berhasil di-reset. Siswa sekarang dapat login kembali.` };
    } catch (e) {
      console.error("Reset login error:", e);
      return fail(500, { error: e.message || "Gagal me-reset login siswa." });
    }
  },
  resetAllActive: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    try {
      await ensureUserLoginColumns(db);
      const userSchoolId = locals.user.school_id;
      let query = `UPDATE users SET is_logged_in = 0, session_token = NULL WHERE role = 'siswa' AND is_logged_in = 1`;
      const params = [];
      if (userSchoolId !== null) {
        query += ` AND school_id = ?`;
        params.push(userSchoolId);
      }
      const result = await db.prepare(query).bind(...params).run();
      return { success: `Berhasil me-reset seluruh login siswa yang sedang aktif (${result.meta.changes || 0} siswa).` };
    } catch (e) {
      console.error("Reset all login error:", e);
      return fail(500, { error: e.message || "Gagal me-reset seluruh login siswa." });
    }
  }
};
export {
  actions,
  load
};
