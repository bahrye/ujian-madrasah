import { fail, redirect } from "@sveltejs/kit";
import { g as getDB } from "../../../../chunks/db.js";
import { h as hashPassword } from "../../../../chunks/auth.js";
import { d as deleteFromCloudinary } from "../../../../chunks/cloudinary.js";
import { b as private_env } from "../../../../chunks/shared-server.js";
const load = async ({ locals, url, platform }) => {
  if (!locals.user) throw redirect(302, "/login");
  const db = getDB(platform);
  const search = url.searchParams.get("search") || "";
  const classFilter = url.searchParams.get("class") || "";
  try {
    await db.prepare("ALTER TABLE users ADD COLUMN place_of_birth TEXT").run();
  } catch {
  }
  try {
    await db.prepare("ALTER TABLE users ADD COLUMN date_of_birth TEXT").run();
  } catch {
  }
  try {
    await db.prepare("ALTER TABLE users ADD COLUMN photo TEXT").run();
  } catch {
  }
  try {
    await db.prepare("ALTER TABLE uploaded_media ADD COLUMN school_id INTEGER").run();
  } catch {
  }
  let query = `
		SELECT u.id, u.username, u.name, u.is_active, u.created_at, u.class_id, c.name as class_name, u.place_of_birth, u.date_of_birth, u.photo 
		FROM users u 
		LEFT JOIN classes c ON u.class_id = c.id 
		WHERE u.school_id = ? AND u.role = 'siswa'
	`;
  const params = [locals.user.school_id];
  if (search) {
    query += " AND (u.username LIKE ? OR u.name LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  if (classFilter) {
    query += " AND u.class_id = ?";
    params.push(classFilter);
  }
  query += " ORDER BY c.name ASC, u.name ASC LIMIT 200";
  try {
    const [usersResult, classesResult, school] = await Promise.all([
      db.prepare(query).bind(...params).all(),
      db.prepare("SELECT id, name FROM classes WHERE school_id = ? ORDER BY name ASC").bind(locals.user.school_id).all(),
      db.prepare("SELECT name, logo_url FROM schools WHERE id = ?").bind(locals.user.school_id).first()
    ]);
    return {
      users: usersResult.results || [],
      classes: classesResult.results || [],
      schoolName: school?.name || "",
      schoolLogo: school?.logo_url || ""
    };
  } catch (err) {
    console.error("Error loading students, attempting fallback query:", err);
    const fallbackQuery = `
			SELECT u.id, u.username, u.name, u.is_active, u.created_at, u.class_id, c.name as class_name, NULL as place_of_birth, NULL as date_of_birth, NULL as photo 
			FROM users u 
			LEFT JOIN classes c ON u.class_id = c.id 
			WHERE u.school_id = ? AND u.role = 'siswa'
			ORDER BY c.name ASC, u.name ASC LIMIT 200
		`;
    const [usersResult, classesResult, school] = await Promise.all([
      db.prepare(fallbackQuery).bind(locals.user.school_id).all(),
      db.prepare("SELECT id, name FROM classes WHERE school_id = ? ORDER BY name ASC").bind(locals.user.school_id).all(),
      db.prepare("SELECT name, logo_url FROM schools WHERE id = ?").bind(locals.user.school_id).first()
    ]);
    return {
      users: usersResult.results || [],
      classes: classesResult.results || [],
      schoolName: school?.name || "",
      schoolLogo: school?.logo_url || ""
    };
  }
};
const actions = {
  add: async ({ request, locals, platform }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const data = await request.formData();
    const name = data.get("name")?.toString().trim();
    const nisn = data.get("nisn")?.toString().trim();
    const class_id = data.get("class_id")?.toString() || null;
    const place_of_birth = data.get("place_of_birth")?.toString().trim() || null;
    const date_of_birth = data.get("date_of_birth")?.toString() || null;
    if (!name || !nisn) {
      return fail(400, { error: "Nama dan NISN wajib diisi" });
    }
    try {
      const existing = await db.prepare("SELECT id FROM users WHERE username = ?").bind(nisn).first();
      if (existing) {
        return fail(400, { error: "NISN sudah terdaftar" });
      }
      const passwordHash = await hashPassword(nisn);
      await db.prepare("INSERT INTO users (school_id, class_id, username, password_hash, name, role, place_of_birth, date_of_birth) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(locals.user.school_id, class_id, nisn, passwordHash, name, "siswa", place_of_birth, date_of_birth).run();
      return { success: true };
    } catch (e) {
      return fail(500, { error: "Gagal menambahkan siswa" });
    }
  },
  edit: async ({ request, locals, platform }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const data = await request.formData();
    const id = data.get("id")?.toString();
    const name = data.get("name")?.toString().trim();
    const nisn = data.get("nisn")?.toString().trim();
    const class_id = data.get("class_id")?.toString() || null;
    const place_of_birth = data.get("place_of_birth")?.toString().trim() || null;
    const date_of_birth = data.get("date_of_birth")?.toString() || null;
    if (!id || !name || !nisn) {
      return fail(400, { error: "ID, Nama dan NISN wajib diisi" });
    }
    try {
      const existing = await db.prepare("SELECT id FROM users WHERE username = ? AND id != ?").bind(nisn, id).first();
      if (existing) {
        return fail(400, { error: "NISN sudah digunakan siswa lain" });
      }
      const passwordHash = await hashPassword(nisn);
      await db.prepare('UPDATE users SET name = ?, username = ?, password_hash = ?, class_id = ?, place_of_birth = ?, date_of_birth = ?, updated_at = datetime("now") WHERE id = ? AND school_id = ?').bind(name, nisn, passwordHash, class_id, place_of_birth, date_of_birth, id, locals.user.school_id).run();
      return { success: true };
    } catch (e) {
      return fail(500, { error: "Gagal mengupdate siswa" });
    }
  },
  delete: async ({ request, locals, platform }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const data = await request.formData();
    const id = data.get("id")?.toString();
    if (!id) return fail(400, { error: "ID tidak valid" });
    try {
      await db.batch([
        db.prepare("DELETE FROM student_answers WHERE attempt_id IN (SELECT id FROM student_attempts WHERE student_id = ?)").bind(id),
        db.prepare("DELETE FROM student_attempts WHERE student_id = ?").bind(id),
        db.prepare("DELETE FROM exam_participants WHERE student_id = ?").bind(id),
        db.prepare('DELETE FROM users WHERE id = ? AND school_id = ? AND role = "siswa"').bind(id, locals.user.school_id)
      ]);
      return { success: true, message: "Berhasil menghapus data siswa." };
    } catch (e) {
      console.error("Delete student error:", e);
      return fail(500, { error: "Gagal menghapus siswa" });
    }
  },
  deleteBulk: async ({ request, locals, platform }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const data = await request.formData();
    const idsJson = data.get("ids")?.toString();
    if (!idsJson) return fail(400, { error: "Pilih minimal satu siswa." });
    try {
      const ids = JSON.parse(idsJson);
      if (!Array.isArray(ids) || ids.length === 0) {
        return fail(400, { error: "Pilih minimal satu siswa." });
      }
      const stmts = [];
      for (const id of ids) {
        stmts.push(
          db.prepare("DELETE FROM student_answers WHERE attempt_id IN (SELECT id FROM student_attempts WHERE student_id = ?)").bind(id),
          db.prepare("DELETE FROM student_attempts WHERE student_id = ?").bind(id),
          db.prepare("DELETE FROM exam_participants WHERE student_id = ?").bind(id),
          db.prepare('DELETE FROM users WHERE id = ? AND school_id = ? AND role = "siswa"').bind(id, locals.user.school_id)
        );
      }
      if (stmts.length > 0) {
        await db.batch(stmts);
      }
      return { success: true, message: `Berhasil menghapus ${ids.length} siswa terpilih.` };
    } catch (e) {
      console.error("Delete bulk students error:", e);
      return fail(500, { error: "Gagal menghapus siswa terpilih" });
    }
  },
  importExcel: async ({ request, locals, platform }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const data = await request.formData();
    const studentsJson = data.get("students_json")?.toString();
    if (!studentsJson) {
      return fail(400, { error: "Data tidak valid" });
    }
    try {
      const students = JSON.parse(studentsJson);
      if (students.length === 0) return fail(400, { error: "Tidak ada data siswa" });
      let successCount = 0;
      for (const student of students) {
        const existing = await db.prepare("SELECT id FROM users WHERE username = ? AND school_id = ?").bind(student.nisn, locals.user.school_id).first();
        if (!existing) {
          const passwordHash = await hashPassword(student.nisn);
          await db.prepare("INSERT INTO users (school_id, class_id, username, password_hash, name, role, place_of_birth, date_of_birth) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(locals.user.school_id, student.class_id, student.nisn, passwordHash, student.name, "siswa", student.place_of_birth || null, student.date_of_birth || null).run();
          successCount++;
        }
      }
      return { success: true, message: `Berhasil mengimpor ${successCount} siswa dari total ${students.length} data.` };
    } catch (e) {
      console.error("Import error:", e);
      return fail(500, { error: "Terjadi kesalahan saat memproses data import" });
    }
  },
  toggleStatus: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const data = await request.formData();
    const id = data.get("id")?.toString();
    const currentStatus = data.get("is_active")?.toString();
    if (!id || !currentStatus) return fail(400, { error: "Data tidak valid" });
    const newStatus = currentStatus === "1" ? 0 : 1;
    try {
      await db.prepare('UPDATE users SET is_active = ?, updated_at = datetime("now") WHERE id = ? AND school_id = ? AND role = "siswa"').bind(newStatus, id, locals.user.school_id).run();
      return { success: true };
    } catch (e) {
      return fail(500, { error: "Gagal merubah status" });
    }
  },
  updatePhoto: async ({ request, platform, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });
    const db = getDB(platform);
    const data = await request.formData();
    const id = data.get("id")?.toString();
    const photo = data.get("photo")?.toString() || null;
    if (!id) return fail(400, { error: "ID tidak valid" });
    try {
      const oldUser = await db.prepare('SELECT photo FROM users WHERE id = ? AND school_id = ? AND role = "siswa"').bind(id, locals.user.school_id).first();
      const oldPhoto = oldUser?.photo;
      if (oldPhoto && oldPhoto.includes("res.cloudinary.com") && oldPhoto !== photo) {
        try {
          await deleteFromCloudinary(oldPhoto, private_env);
          await db.prepare("DELETE FROM uploaded_media WHERE url = ? AND school_id = ?").bind(oldPhoto, locals.user.school_id).run();
        } catch (err) {
          console.error("Failed to delete old photo from Cloudinary:", err);
        }
      }
      await db.prepare('UPDATE users SET photo = ?, updated_at = datetime("now") WHERE id = ? AND school_id = ? AND role = "siswa"').bind(photo, id, locals.user.school_id).run();
      if (photo && photo.includes("res.cloudinary.com")) {
        try {
          await db.prepare(`
						INSERT INTO uploaded_media (url, media_type, uploaded_by, school_id, is_public) 
						VALUES (?, 'image', ?, ?, 0)
					`).bind(photo, locals.user.id, locals.user.school_id).run();
        } catch (err) {
          if (!err.message?.includes("UNIQUE")) {
            console.error("Failed to log media:", err);
          }
        }
      }
      return { success: true };
    } catch (e) {
      console.error("Update photo error:", e);
      return fail(500, { error: "Gagal merubah foto" });
    }
  }
};
export {
  actions,
  load
};
