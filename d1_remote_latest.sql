PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE schools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
, principal_name TEXT, phone TEXT, email TEXT, npsn TEXT, accreditation TEXT, website TEXT, logo_url TEXT, principal_nip TEXT, postal_code TEXT, province TEXT, city TEXT, district TEXT, village TEXT);
INSERT INTO "schools" ("id","name","address","is_active","created_at","updated_at","principal_name","phone","email","npsn","accreditation","website","logo_url","principal_nip","postal_code","province","city","district","village") VALUES(1,'MIS BUTUNG','Butung, Kel. Bontokamase',1,'2026-08-02 08:07:06','2026-08-04 10:15:11','MUHAMMAD JUFRI, S.Pd.I',NULL,NULL,NULL,'C',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO "schools" ("id","name","address","is_active","created_at","updated_at","principal_name","phone","email","npsn","accreditation","website","logo_url","principal_nip","postal_code","province","city","district","village") VALUES(2,'MTS TANUNTUNG','Banyoro, Kel. Tanuntung',1,'2026-08-02 08:07:06','2026-08-13 03:29:28','MUHAMMAD ASRI, S.Ag., M.Pd',NULL,NULL,NULL,'C',NULL,'https://res.cloudinary.com/dfhtjgwcz/image/upload/v1786356409/ujian-madrasah/school/ennhivenpjhtkslyts6g.png','01947181','92573','Sulawesi Selatan','Bulukumba','Herlang','Tanuntung');
CREATE TABLE classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    level TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO "classes" ("id","school_id","name","level","created_at","updated_at") VALUES(1,1,'X IPA 11','X','2026-08-02 08:07:06','2026-08-03 06:50:33');
INSERT INTO "classes" ("id","school_id","name","level","created_at","updated_at") VALUES(2,1,'XI IPS 2','XI','2026-08-02 08:07:06','2026-08-02 08:07:06');
INSERT INTO "classes" ("id","school_id","name","level","created_at","updated_at") VALUES(5,2,'VII','7','2026-08-05 22:37:20','2026-08-10 15:43:01');
INSERT INTO "classes" ("id","school_id","name","level","created_at","updated_at") VALUES(6,2,'VIII','8','2026-08-05 22:37:26','2026-08-10 15:43:06');
INSERT INTO "classes" ("id","school_id","name","level","created_at","updated_at") VALUES(8,2,'IX','9','2026-08-10 13:01:22','2026-08-13 03:48:44');
CREATE TABLE subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(1,1,'Matematika','MTK','2026-08-02 08:07:06','2026-08-02 08:07:06');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(5,1,'Bahasa Indonesia','BIND','2026-08-04 10:16:10','2026-08-04 10:16:10');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(6,1,'Bahasa Inggris','BING','2026-08-04 10:16:25','2026-08-04 10:16:25');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(7,1,'Bahasa Arab','BAR','2026-08-04 10:16:42','2026-08-04 10:16:42');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(8,1,'Fikih','FIK','2026-08-04 10:16:52','2026-08-04 10:16:52');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(9,1,'Akidah Akhlak','AA','2026-08-04 10:17:01','2026-08-04 10:17:01');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(10,1,'Quran Hadis','QH','2026-08-04 10:17:15','2026-08-04 10:17:15');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(11,1,'Sejarah Kebudayaan Islam','SKI','2026-08-04 10:17:43','2026-08-04 10:17:43');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(12,1,'Penjaskes','PJOK','2026-08-04 10:17:51','2026-08-04 10:17:51');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(13,1,'Ilmu Pengetahuan Alam','IPA','2026-08-04 10:18:09','2026-08-04 10:18:09');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(14,1,'Ilmu Pengetahuan Sosial','IPS','2026-08-04 10:18:23','2026-08-04 10:18:23');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(15,2,'Matematika','MTK','2026-08-05 22:37:49','2026-08-05 22:37:49');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(16,2,'Ilmu Pengetahuan Sosial','IPS','2026-08-05 22:38:04','2026-08-05 22:38:04');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(17,2,'Ilmu Pengetahuan Alam','IPA','2026-08-05 22:38:27','2026-08-05 22:38:27');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(18,2,'Akidah Akhlak','AA','2026-08-05 22:38:35','2026-08-05 22:38:35');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(19,2,'Qur''an Hadis','QH','2026-08-05 22:38:49','2026-08-05 22:38:49');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(20,2,'Sejarah Kebudayaan Islam','SKI','2026-08-05 22:38:56','2026-08-05 22:38:56');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(21,2,'Fikih','FIK','2026-08-05 22:39:14','2026-08-05 22:39:14');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(22,2,'Pendidikan Pancasila','PKN','2026-08-05 22:39:24','2026-08-05 22:39:24');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(23,2,'Bahasa Inggris','BING','2026-08-05 22:39:39','2026-08-05 22:39:39');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(24,2,'Bahasa Indonesia','BIN','2026-08-05 22:39:47','2026-08-05 22:39:47');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(25,2,'Bahasa Arab','BAR','2026-08-05 22:39:57','2026-08-05 22:39:57');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(26,2,'Pendidikan Jasmani Olahraga dan Kesehatan','PJOK','2026-08-05 22:40:26','2026-08-05 22:40:26');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(27,2,'Seni Budaya','SB','2026-08-05 22:40:45','2026-08-05 22:40:45');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(28,2,'Prakarya','PRAK','2026-08-05 22:40:57','2026-08-05 22:40:57');
INSERT INTO "subjects" ("id","school_id","name","code","created_at","updated_at") VALUES(29,2,'Informatika','INF','2026-08-05 22:41:07','2026-08-05 22:41:07');
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('superadmin', 'admin', 'guru', 'pengawas', 'siswa', 'panitia')),
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
, place_of_birth TEXT, date_of_birth TEXT, photo TEXT, nisn TEXT, nomor_peserta TEXT, gender TEXT, session_number INTEGER DEFAULT 1, nip TEXT, is_logged_in INTEGER NOT NULL DEFAULT 0, session_token TEXT, last_active_at TEXT, login_device TEXT, login_pin TEXT);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(1,NULL,NULL,'superadmin','ab1f65147eb4a6d345ee408df300dd4b:6e74c1694d1c1d7429bc7c0f71e18b4015d11de42e553a0a1f8967d5990c0e31','Sistem Superadmin','superadmin',1,'2026-08-02 08:07:06','2026-08-02 08:07:06',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(18,2,NULL,'mtstanuntung','b224eb9192aa0c0b89a0e8bfff45538b:5c74a6fbd3d94d056b9124d21735c9981cccb72e3092df3ed86d1c6f1580564c','MTS TANUNTUNG','admin',1,'2026-08-04 02:29:16','2026-08-04 02:29:16',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,'43589');
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(19,1,NULL,'misbutung','1ad4dd06dd98ff1c2ce67db3bcb27e9c:040d4088c4564f0243516d48cffa36d0208f533371d30a1bbab28af8b7f8b719','MIS BUTUNG','admin',1,'2026-08-04 02:30:33','2026-08-04 02:30:33',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(20,NULL,NULL,'syamsulbahri','31689d49c3de9cc34975c718f4ff4b33:db7a36c0cbe4be2fb9195bdc7497d5e56790c264368bad67e1ed984e7e7a1edd','SYAMSUL BAHRI','superadmin',1,'2026-08-04 02:44:50','2026-08-04 02:44:50',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(29,1,1,'1234567890','4936bd6ce9e272c84de4ace80653042c:2d57dfc65a8ad95ba5fba678f503126a7717416a5d23f35329f2de95d7daa3b6','Andi','siswa',1,'2026-08-04 10:41:50','2026-08-04 10:41:50','Bulukumba','2026-08-03',NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(30,1,NULL,'pengawas','a283c49a386972b92bd6a05c59670a7a:2049b3d49c991d0adefdd77cdb09cce2b5d27066c58fa3bc010bca61b9191c60','Syamsul Bahri','pengawas',1,'2026-08-04 10:52:03','2026-08-04 10:52:03',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(35,2,NULL,'pengawas123','7fd8cd1f825095b087acfad3efe366d3:35597fc04b3a01a960998996df6bc539523184c20c322b627ac1819903522780','Pengawas Ruang 21 koma tiga','pengawas',1,'2026-08-06 00:37:58','2026-08-16 02:14:51',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,'94153');
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(38,2,NULL,'peng','1bed60c3435ed79d29667397f667851a:e93083de504715d871e3cbd65474978e6c012548f3cc05dc93bd8df29d8e72f3','Adqwnfkllnk','pengawas',1,'2026-08-06 23:06:57','2026-08-13 03:43:28',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,'27736');
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(40,2,NULL,'panitia1','5a67660d67df043433cedc95973008b7:aeb6b88023da347a2e29a596168720d5d571dfd9b8b532fe4346c3a1b30b40d9','Panitia 1','panitia',1,'2026-08-09 02:15:17','2026-08-15 04:06:21',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,'17655');
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(48,2,8,'AUTO-MSQZFLHC-441','5f2a216577e5824ee56b4b6089d97796:9bb33e85e2c68c9b1838105c0133bfc13513a2afe2fb7b046ea67b7aa97cf0f5','ABDI AL ISLAMI','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BULUKUMBA','2012-01-23',NULL,'0125104787','AUTO-MSQZFLHC-441','L',1,NULL,0,NULL,'2026-08-17 13:33:52','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(49,2,8,'AUTO-MSQZFLHC-687','7b818cdb1928852eb6594f06ab981e3b:15fddf7e6c2055c68456ab15f1b639f7c900bec42261ae44cac87c1afb2f1dc7','AHMAD MARCEL','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BULUKUMBA','2012-10-22',NULL,'0128573635','AUTO-MSQZFLHC-687','L',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(50,2,8,'AUTO-MSQZFLHC-874','e0e87c29dcf879728997090e37d9e7a7:630c63d25152f2006d5089584dfda3256639d43da690f3a564e850830b8ec2e3','AIRA NAJWA PRATIWI','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BANYORO','2012-06-10',NULL,'0126751265','AUTO-MSQZFLHC-874','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(51,2,5,'AUTO-MSQZFLHC-764akhwriw','bbffb05a297c147290ea74cb851bc2b4:389c7095969f942b75c669bf9568df581812e4fd1eb36583e159901426986633','AISYA MAHARANI','siswa',1,'2026-08-13 03:52:31','2026-08-21 17:27:14',NULL,'2013-02-15',NULL,'3139804474','AUTO-MSQZFLHC-764akhwriw','P',1,NULL,0,NULL,NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(52,2,6,'AUTO-MSQZFLHC-424','e3499412249bec3f398bef1a8c7d98d9:5f73a326d3a582b8294f613ecbe4ab9ce2a743f159bf649316939c5e77a9c192','ALISA SOFIA','siswa',1,'2026-08-13 03:52:31','2026-08-13 03:52:31','BULUKUMBA','2013-07-08',NULL,'0137843869','AUTO-MSQZFLHC-424','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(53,2,8,'AUTO-MSQZFLHC-102','b88ca1544762796f98fe3c25a2caf866:95ca1eb1bd0ccbf7217f5bb642292cebe611e5fc07652a60d2e4dc31aec2d000','AMEL','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','KASSI-KASSI','2011-10-26',NULL,'0115523328','AUTO-MSQZFLHC-102','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(54,2,6,'AUTO-MSQZFLHC-829','3c9a302ef36f17ddcd90a381cd9e1fe2:31a1a662560460716720e9a8ec8ba56155e7dccf5e1c755ebd5cc6713b4fe491','ANDI AWAL RAMADHANI','siswa',1,'2026-08-13 03:52:31','2026-08-13 03:52:31','BULUKUMBA','2012-07-20',NULL,'0129240771','AUTO-MSQZFLHC-829','L',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(55,2,6,'AUTO-MSQZFLHC-513','3cbb1f1297421a6dfc7d7fcff877c646:5c69a064d191ddc70848945134316bd0f4e13f3022500540c96ca3fd685afc5b','ANDINA RESTI','siswa',1,'2026-08-13 03:52:31','2026-08-13 03:52:31','NIPISI','2013-03-15',NULL,'0131823138','AUTO-MSQZFLHC-513','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(56,2,8,'AUTO-MSQZFLHC-879','a79faa068bf657dfeebf9c6ee7b560e1:5fae19f54eda3a9d211e995b6eb4c3c19ad818b2a7685e1ece6fc468970c67b0','ASMAUL HUSNA','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BULUKUMBA','2012-01-14',NULL,'0123809689','AUTO-MSQZFLHC-879','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(57,2,5,'AUTO-MSQZFLHC-700','0bd3bd985b5db1477799300d95246f34:e888a24a030faac48ea8e5c2c22fde43ef765861b926f5fffd72d6a01c9326bf','AULIA RESKY RAMADANI','siswa',1,'2026-08-13 03:52:31','2026-08-21 17:27:14',NULL,'2014-05-05',NULL,'3142289915','AUTO-MSQZFLHC-700','P',1,NULL,0,NULL,NULL,'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36',NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(58,2,5,'AUTO-MSQZFLHC-378','287a4a4d4d175efd3bbd11156e7996bb:c5cf7be94fdcf347c1c7c820e91f32f786051dc675fa2e3ce444f63f31750873','AYLA ANANDA PUTRI','siswa',1,'2026-08-13 03:52:31','2026-08-21 17:27:14',NULL,'2014-04-25',NULL,'3149890553','AUTO-MSQZFLHC-378','P',1,NULL,1,'1e178ed5-b008-462b-a677-ac83ad4b6023','2026-08-22 06:25:05','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36',NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(59,2,5,'AUTO-MSQZFLHC-087','8e251002608bcc2858091e90133ad9d0:73ea44019bacb20f9ca7062daac6b62ad7dccd93302cc6998a9f0cf2cd07cd9d','DIVA ALMA HIRA','siswa',1,'2026-08-13 03:52:31','2026-08-21 17:27:14',NULL,'2013-11-01',NULL,'0135235187','AUTO-MSQZFLHC-087','P',1,NULL,0,NULL,'2026-08-18 10:07:31','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36',NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(60,2,8,'AUTO-MSQZFLHC-423','df1326e90c470623d37b8e88fa459b89:558558879be1a9aa56aa95ab4db345cbd626a1587195322dfd231b7abcfa72a2','ENCI','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','KASSI-KASSI','2010-09-01',NULL,'0102889107','AUTO-MSQZFLHC-423','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(61,2,6,'AUTO-MSQZFLHC-055','4bbb3f7175da4987ecc5567cc342f481:86207550a640772078845cae8e6d43188d3c6d166b49668d499cbf09d73be1a8','FADILAH NURAINI','siswa',1,'2026-08-13 03:52:31','2026-08-13 03:52:31','BULUKUMBA','2013-06-07',NULL,'0133464070','AUTO-MSQZFLHC-055','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(62,2,8,'AUTO-MSQZFLHC-633','3efe5a9e6c9046f4527e13261d5abe33:a99616021c9c0c8038df2f56c348e2f8ae5cef339c8bbd0e5cb7d110740955b4','FAHRUL MUBARAQ','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BULUKUMBA','2012-07-03',NULL,'0121967504','AUTO-MSQZFLHC-633','L',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(63,2,6,'AUTO-MSQZFLHC-718','8dce50dfb6abb6cc5d9028c16ae22c9c:0a625341990c9aeb38473bf704386c4b83a9a72fbaee494ee11c45fa9e8c088a','FIKA ALISDA','siswa',1,'2026-08-13 03:52:31','2026-08-13 03:52:31','NIPISI','2012-12-04',NULL,'0125131207','AUTO-MSQZFLHC-718','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(64,2,8,'AUTO-MSQZFLHC-808','6e6c658e6f0c231de20d5479f9ab7e8a:597dac6a0c0abd40cba9e9ccd28ded3dade3c9a4d9e6d809cf94927b88f73c66','ILAL FAHRI','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BONTOBANA','2012-04-25',NULL,'0126917747','AUTO-MSQZFLHC-808','L',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(65,2,8,'AUTO-MSQZFLHC-807','5b3b4d72c5db48fb1a258f78d04315be:5ed9fe643284a2685319d40ba2a2259f0aa15fb1bda5effbd68ebb1cb40f95bb','MUH. ADRIAN','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BULUKUMBA','2012-05-30',NULL,'3128240040','AUTO-MSQZFLHC-807','L',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(66,2,6,'AUTO-MSQZFLHC-123','ea44363cab1236f02a2b97fcac989ef6:2fb8830cbd0212640a53f189ea6f812334f338ce4814624d91e9fefc74a24c08','MUH. AKBAR MUSLIM','siswa',1,'2026-08-13 03:52:31','2026-08-13 03:52:31','BONTOBANA','2012-09-24',NULL,'0125977789','AUTO-MSQZFLHC-123','L',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(67,2,6,'AUTO-MSQZFLHC-041','411b8178174ab2179ef5d1a6728b9688:149645d79c9d6d4fcfeb8bff08f65c73d406485548fd4821d41da88f90b50f63','MUH. AZHAR AL PRATAMA','siswa',1,'2026-08-13 03:52:31','2026-08-13 03:52:31','BULUKUMBA','2013-04-13',NULL,'0134390484','AUTO-MSQZFLHC-041','L',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(68,2,8,'AUTO-MSQZFLHC-537','68ab2fd381a310d333c82ddc701c59e6:6ecba069d358830e2901700190ce9f043bc22485e722367ed4e125a05343bada','MUH. HERI ALFARIZIH','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BULUKUMBA','2010-11-28',NULL,'3102075762','AUTO-MSQZFLHC-537','L',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(69,2,6,'AUTO-MSQZFLHC-042','5cfe22fe0ed4c65fb050f1c39273fbb7:3fff9c9e97523dea00781364adb3c5694ebf8498ae8fe56a8ac0984db1b66ffb','MUH. KESYA DINAR','siswa',1,'2026-08-13 03:52:31','2026-08-13 03:52:31','BANYORO','2013-06-21',NULL,'0137792883','AUTO-MSQZFLHC-042','L',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(70,2,6,'AUTO-MSQZFLHC-650','99510f15d57aae734e6700fff2318271:2babbce6b7f5e10dccea87bd190673b2b9c6d2b0d3250e93e12fe5058a5b2103','MUHAMMAD AKBAR','siswa',1,'2026-08-13 03:52:31','2026-08-13 03:52:31','BULUKUMBA','2013-04-10',NULL,'0136584450','AUTO-MSQZFLHC-650','L',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(71,2,8,'AUTO-MSQZFLHC-314','e44765269c82388b79eaf86d9eddc15c:583b21edec0dff81c1f0f3ecdb4639cd2f7677ba835cceb1fd6750cb68f30897','MUHAMMAD FACHRIL SYAM','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BULUKUMBA','2010-12-21',NULL,'3101681101','AUTO-MSQZFLHC-314','L',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(72,2,8,'AUTO-MSQZFLHC-616','d502002a4f7fbc4d907ae8116f1bb83b:0ded597a3231979e04beba67f8040a4eaf2315adeb49c9efddb0573ae870f000','MUHAMMAD FADIL CAESAR QURAIS','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BIAK','2012-06-11',NULL,'0128110312','AUTO-MSQZFLHC-616','L',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(73,2,5,'AUTO-MSQZFLHC-730','825e13078536e09a22aa725529c30c77:e6e53e6c31f3a1da4b47d6ffd2cb6c2fc74849cb41d0049cbeb48f4865959014','MUHAMMAD FAIZ','siswa',1,'2026-08-13 03:52:31','2026-08-21 17:27:14',NULL,'2010-10-09',NULL,'3106145934','AUTO-MSQZFLHC-730','L',1,NULL,0,NULL,'2026-08-18 10:07:49','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36',NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(74,2,5,'AUTO-MSQZFLHC-508','cd38be4982dc0be3ad4359b6e289ef7b:afaccce29b939e4f8acce8f8a7bcdb7241107e92093e71f8d9b5968a1cdd1896','MUHAMMAD HAIKAL','siswa',1,'2026-08-13 03:52:31','2026-08-21 17:27:14',NULL,'2014-12-26',NULL,'0141635801','AUTO-MSQZFLHC-508','L',1,NULL,0,NULL,NULL,'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36',NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(75,2,8,'AUTO-MSQZFLHC-754','b432d84e38ccfd381469d8d4917668bc:e5456e6ac5b7fcfaad96ce41257307961f2ac64e5b7cbd10d54db2fd45b9a5b0','NAYLA AL MUQARRABINA','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','MAKASSAR','2012-03-25',NULL,'0125222183','AUTO-MSQZFLHC-754','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(76,2,8,'AUTO-MSQZFLHC-984','7d9ca7120a02c9324886dfe51d0ba55f:bc7d468dbf49639b39d41bc3844a752abef83379e73670b3a55720319f7372dd','NUR FITRA','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BULUKUMBA','2012-03-23',NULL,'3122934742','AUTO-MSQZFLHC-984','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(77,2,6,'AUTO-MSQZFLHC-012','e78520ff287986732b18ada186e3a8fc:34b1cbdd1d40213e9678c767cdfe720a825199de79a9ca43b587ec84c4970a78','NUR MISNAWATI','siswa',1,'2026-08-13 03:52:31','2026-08-13 03:52:31','BULUKUMBA','2013-06-27',NULL,'3136812096','AUTO-MSQZFLHC-012','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(78,2,6,'AUTO-MSQZFLHC-804','18dc0452e1247f11bb7e05ef282ff1e4:852b3b2cce2e953ca089cfb003b3a131e53f9f45bccaede6a119d77ff43eb00e','NURANISA','siswa',1,'2026-08-13 03:52:31','2026-08-13 03:52:31','BULUKUMBA','2012-12-03',NULL,'0126195581','AUTO-MSQZFLHC-804','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(79,2,8,'AUTO-MSQZFLHC-373','bfd3ce742ad79317a6d223c971ca6098:318ea93ace5e71e5e96fcc90ddc0c1f487f04d1c59b20deabf3c9b43e8b10485','NURARIYANI SYAPIKA','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BULUKUMBA','2012-02-26',NULL,'3125747157','AUTO-MSQZFLHC-373','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(80,2,6,'AUTO-MSQZFLHC-745','b237009c80ae2d830ca92d8cbd495c41:cf8a5802ef855f5b97cc1583bee9368f5d798858ed44b8c3aeffc981c692b186','NURASYIKING','siswa',1,'2026-08-13 03:52:31','2026-08-13 03:52:31','BULUKUMBA','2013-11-12',NULL,'3135182355','AUTO-MSQZFLHC-745','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(81,2,5,'AUTO-MSQZFLHC-656','ea47e0ee4a7a61359cabc912509df6db:49d85b0eb5c016278ce894c1bbac669a83bb91fae5e17298458a1c085bfa3c1f','NURAZIZAH','siswa',1,'2026-08-13 03:52:31','2026-08-21 17:27:14',NULL,'2013-07-07',NULL,'3136217163','AUTO-MSQZFLHC-656','P',1,NULL,0,NULL,NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(82,2,6,'AUTO-MSQZFLHC-030','b781a10ffb987f40fe3e4c9822075b9a:4f7ee11de3fb7a30cbd284c5951b7cf38815af94bfbdbdab1d924fcca340b3aa','NURSAFIKA','siswa',1,'2026-08-13 03:52:31','2026-08-13 03:52:31','NIPISI','2012-09-30',NULL,'3125963558','AUTO-MSQZFLHC-030','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(83,2,8,'AUTO-MSQZFLHC-083','fb47b2ce14fe49ae7cde47d1ce25b5d1:145e3987eacda4be05c3d82f0e91a2a3b92d15399f39633c19c07e38ef93d58a','NURSALSABILAH','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BULUKUMBA','2012-01-24',NULL,'0116633289','AUTO-MSQZFLHC-083','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(84,2,8,'AUTO-MSQZFLHC-080','26488635a32b2a762ff976735c9896d8:b2744d2ff91c4f1d6b07515221c6092a6583d57f2954893b0a741bdb49ec9c00','NURSYAFIRA','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BONTOTANGNGA','2012-12-10',NULL,'0124773964','AUTO-MSQZFLHC-080','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(85,2,8,'AUTO-MSQZFLHC-778','9963c6fa319fcf54e95bfa559b6887da:794e8dd8bd198ca767892f7eacf219017c3eb0a2d868eec80c2199caf51ac86a','NURSYIFAH','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BULUKUMBA','2012-09-19',NULL,'3128804659','AUTO-MSQZFLHC-778','P',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(86,2,5,'AUTO-MSQZFLHC-490','3ee84d9058795211c68ad67e32b64f4c:62f24e928ea7a7eef7e7fb547c506e12bd3dad42561ea02b81f20ac21c5c6a6a','NURUL SAFIKA SARI','siswa',1,'2026-08-13 03:52:31','2026-08-21 17:27:14',NULL,'2014-08-12',NULL,'3145545147','AUTO-MSQZFLHC-490','P',1,NULL,0,NULL,'2026-08-18 17:37:11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(87,2,5,'AUTO-MSQZFLHC-111','3f1dffbf9a897936b12f0c00eb3a66bd:1f77a793d99ebd81ebce213693625cb9f017e2fe550df43fb9e2b42c17d5b07c','RANDY OMAR','siswa',1,'2026-08-13 03:52:31','2026-08-21 17:27:14',NULL,'2012-05-21',NULL,'3129069631','AUTO-MSQZFLHC-111','L',1,NULL,0,NULL,'2026-08-18 16:55:50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(88,2,8,'AUTO-MSQZFLHC-916','1f288d4880f0064319bec13e3c61aee9:56c950904f2f18328a9bb64fc61a8995374569ec83384f5e93c91184a103caa4','RASUL','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BULUKUMBA','2011-10-17',NULL,'0111601099','AUTO-MSQZFLHC-916','L',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(89,2,8,'AUTO-MSQZFLHC-032','dbfa5a3641f9fd8042857a5001d18284:647baf0e280d8ff6207ce63ce355915acd0c58632ae5063eadcae5a3d7560c69','RESKY AHMAD MAULID','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BULUKUMBA','2012-02-12',NULL,'0128571209','AUTO-MSQZFLHC-032','L',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(90,2,8,'AUTO-MSQZFLHC-224','f6c633a9a79a5b178676e1d2d9003209:61deea20a600562fe5b578879d279288c7e1d845dde3e84fb2103715b8fe09c7','SYAIFAL','siswa',1,'2026-08-13 03:52:31','2026-08-17 14:06:22','BULUKUMBA','2012-02-18',NULL,'0123982501','AUTO-MSQZFLHC-224','L',1,NULL,0,NULL,NULL,NULL,NULL);
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(91,2,NULL,'asmaMTS','4b90eb72305d4ba9d609f4b1b05265ff:4819eb17c6a2f94ace3dc32fcd034638e63efa64e6bf81806b47b37f22da4898','ASMA, S.Pd.I','guru',1,'2026-08-13 03:58:28','2026-08-14 13:16:16',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,'56190');
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(92,2,NULL,'ayuandiraMTS','a355df9c1e745ca12100537c7d2266b1:dd0406f9bf1379f28b584999f59a144bcfc606e82ba191b107e2c7caf638b828','AYU ANDIRA, S.Pd','guru',1,'2026-08-13 03:58:28','2026-08-14 13:16:21',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,'70584');
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(93,2,NULL,'bungacitralestariMTS','f6fd99737057c0de88b548ef317505f5:88a04bd6a41c2dd4adfc1f58c1f5c7d0a869d41212406e5c10929e3215fc81fd','BUNGA CITRA LESTARI, S.Pd','guru',1,'2026-08-13 03:58:28','2026-08-14 13:16:26',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,'97759');
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(94,2,NULL,'hasrawatiMTS','5e891e65f079a3dd050dbcc7661b8e01:865c33186a8c667b0d51c530c68f455be1b2420e0c8c7748c3029f33f6771792','HASRAWATI, S.Pd.I','guru',1,'2026-08-13 03:58:28','2026-08-14 13:16:31',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,'45485');
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(95,2,NULL,'rosmalaMTS','d713698a477f3d19f03eea4ba0ade309:fd4bf400531958a24b9159c4310f4a653e9268f09a9b31ff0228ae33b2ca1016','ROSMALA, S.E','guru',1,'2026-08-13 03:58:28','2026-08-14 13:16:35',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,'19540');
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(96,2,NULL,'salmawatiMTS','b0d1b133228921bbbd5cda3137105408:4b2b52ba06f798f3ec96a37c21f6d888cd650d59ae15a3d6146710520d00281f','SALMAWATI, S.Pd','guru',1,'2026-08-13 03:58:28','2026-08-14 13:16:41',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,'35879');
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(97,2,NULL,'suhriahMTS','53ecd948ffdffe08f17b53867ec4dbe5:b1b6f3fe2930b5d221fa3a07af323f8c33ea277d59c59fd924d84949d4b67b7a','SUHRIAH, S.Pd','guru',1,'2026-08-13 03:58:28','2026-08-14 13:16:47',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,'28087');
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(98,2,NULL,'suriatiMTS','01b248c3500c60e047f0ae2c81c5645a:3a6867075dc085567c02f8ca309ef8faee35ba3362fbbabc497640483c161b24','SURIATI, S.Pd','guru',1,'2026-08-13 03:58:28','2026-08-14 13:16:52',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,'40473');
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(99,2,NULL,'syamsulbahriMTS','902e639311c1d0a5fca9093af5103421:472d5c71141621405a2a05843519791b6651089f73060e6118022737a93829b1','SYAMSUL BAHRI, S.Tr.T','guru',1,'2026-08-13 03:58:28','2026-08-14 13:16:59',NULL,NULL,NULL,NULL,NULL,NULL,1,'020852097',0,NULL,NULL,NULL,'70838');
INSERT INTO "users" ("id","school_id","class_id","username","password_hash","name","role","is_active","created_at","updated_at","place_of_birth","date_of_birth","photo","nisn","nomor_peserta","gender","session_number","nip","is_logged_in","session_token","last_active_at","login_device","login_pin") VALUES(100,2,NULL,'yustikanurMTS','15b109aec004f404102ab200fa18875a:55b2c4c35c5178547ca84eb07b286302b537f2cbcca78665031324dd1af51f29','YUSTIKA NUR, S.Pd','guru',1,'2026-08-13 03:58:28','2026-08-14 13:17:04',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,NULL,NULL,NULL,'34198');
CREATE TABLE exam_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    start_time TEXT,
    end_time TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO "exam_types" ("id","school_id","code","name","description","start_time","end_time","is_active","created_at") VALUES(1,1,'UMUM','Ujian Umum','Tipe ujian default untuk sistem','2026-08-05 00:00:43','2027-08-05 00:00:43',1,'2026-08-05 00:00:43');
INSERT INTO "exam_types" ("id","school_id","code","name","description","start_time","end_time","is_active","created_at") VALUES(5,2,'PAT26','Penilaian Akhir Tahun 2026','Penilai ajdkjwhf','2026-08-05T09:27','2026-08-24T07:17',1,'2026-08-05 23:17:58');
CREATE TABLE exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    start_time TEXT,
    end_time TEXT,
    is_active INTEGER NOT NULL DEFAULT 0,
    shuffle_questions INTEGER NOT NULL DEFAULT 0,
    show_result INTEGER NOT NULL DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
, show_score_type TEXT DEFAULT 'after_submit', is_score_released INTEGER DEFAULT 0, exam_type_id INTEGER REFERENCES exam_types(id) ON DELETE SET NULL, class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE, max_attempts INTEGER NOT NULL DEFAULT 1);
INSERT INTO "exams" ("id","school_id","subject_id","title","description","duration_minutes","start_time","end_time","is_active","shuffle_questions","show_result","created_by","created_at","updated_at","show_score_type","is_score_released","exam_type_id","class_id","max_attempts") VALUES(5,1,1,'PAS - Matematika 2026','',120,'2026-08-04T07:30','2026-08-04T09:28',1,1,0,NULL,'2026-08-03 06:51:38','2026-08-03 23:28:20','after_end_time',0,1,NULL,1);
INSERT INTO "exams" ("id","school_id","subject_id","title","description","duration_minutes","start_time","end_time","is_active","shuffle_questions","show_result","created_by","created_at","updated_at","show_score_type","is_score_released","exam_type_id","class_id","max_attempts") VALUES(19,2,17,'PAT26 - Ilmu Pengetahuan Alam','',60,'2026-08-22T08:28','2026-08-23T11:56',1,1,0,18,'2026-08-13 04:24:35','2026-08-21 17:27:13','manual',1,5,5,1);
INSERT INTO "exams" ("id","school_id","subject_id","title","description","duration_minutes","start_time","end_time","is_active","shuffle_questions","show_result","created_by","created_at","updated_at","show_score_type","is_score_released","exam_type_id","class_id","max_attempts") VALUES(20,2,27,'PAT26 - Seni Budaya','',60,'2026-08-05T09:27','2026-08-24T07:17',1,1,0,18,'2026-08-14 12:19:05','2026-08-14 12:19:05','after_submit',0,5,8,2);
INSERT INTO "exams" ("id","school_id","subject_id","title","description","duration_minutes","start_time","end_time","is_active","shuffle_questions","show_result","created_by","created_at","updated_at","show_score_type","is_score_released","exam_type_id","class_id","max_attempts") VALUES(21,2,21,'PAT26 - Fikih','',60,NULL,NULL,1,1,0,18,'2026-08-15 03:44:12','2026-08-15 03:44:12','after_type_end_time',0,5,8,1);
INSERT INTO "exams" ("id","school_id","subject_id","title","description","duration_minutes","start_time","end_time","is_active","shuffle_questions","show_result","created_by","created_at","updated_at","show_score_type","is_score_released","exam_type_id","class_id","max_attempts") VALUES(23,2,26,'PAT26 - Pendidikan Jasmani Olahraga dan Kesehatan','',60,'2026-08-22T01:25','2026-08-24T01:25',1,1,0,18,'2026-08-15 13:43:39','2026-08-21 17:25:24','after_type_end_time',0,5,5,1);
INSERT INTO "exams" ("id","school_id","subject_id","title","description","duration_minutes","start_time","end_time","is_active","shuffle_questions","show_result","created_by","created_at","updated_at","show_score_type","is_score_released","exam_type_id","class_id","max_attempts") VALUES(24,2,19,'PAT26 - Qur''an Hadis','',60,NULL,NULL,1,1,0,18,'2026-08-15 13:48:07','2026-08-17 13:49:51','after_type_end_time',0,5,5,1);
INSERT INTO "exams" ("id","school_id","subject_id","title","description","duration_minutes","start_time","end_time","is_active","shuffle_questions","show_result","created_by","created_at","updated_at","show_score_type","is_score_released","exam_type_id","class_id","max_attempts") VALUES(25,2,22,'PAT26 - Pendidikan Pancasila','',60,'2026-08-05T09:27','2026-08-24T07:17',1,1,0,18,'2026-08-17 13:50:32','2026-08-17 13:50:32','after_type_end_time',0,5,8,1);
INSERT INTO "exams" ("id","school_id","subject_id","title","description","duration_minutes","start_time","end_time","is_active","shuffle_questions","show_result","created_by","created_at","updated_at","show_score_type","is_score_released","exam_type_id","class_id","max_attempts") VALUES(26,2,17,'PAT26 - Ilmu Pengetahuan Alam (IX)','',60,'2026-08-05T09:27','2026-08-24T07:17',1,1,0,18,'2026-08-17 14:06:22','2026-08-17 14:06:22','after_type_end_time',0,5,8,1);
CREATE TABLE questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK(type IN ('pilihan_ganda', 'pilihan_ganda_kompleks', 'isian_singkat', 'essay', 'benar_salah', 'menjodohkan')),
    question_text TEXT NOT NULL,
    question_number INTEGER NOT NULL DEFAULT 0,
    points INTEGER NOT NULL DEFAULT 1,
    media_type TEXT CHECK(media_type IN ('image', 'audio') OR media_type IS NULL),
    media_url TEXT,
    audio_max_plays INTEGER DEFAULT 3,
    options_json TEXT,
    correct_answer_json TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(295,19,'pilihan_ganda','<p>Siapa penemu bola lampu pijar?</p>',1,1,NULL,NULL,3,'["Thomas Alfa Edison","Alexander Graham Bell","Nikola Tesla","Albert Einstein"]','"A"','2026-08-14 06:14:22');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(296,19,'pilihan_ganda_kompleks','<p>Manakah dari hewan berikut yang termasuk mamalia? (Pilihan Ganda Kompleks)</p>',2,1,NULL,NULL,3,'["Kucing","Ayam","Paus","Katak"]','["A","C"]','2026-08-14 06:14:22');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(297,19,'benar_salah','<p>Matahari terbit dari sebelah barat. (Benar/Salah)</p>',3,1,NULL,NULL,3,'["Benar","Salah"]','"Salah"','2026-08-14 06:14:22');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(298,19,'isian_singkat','<p>Ibukota negara Indonesia adalah ... (Isian Singkat)</p>',4,1,NULL,NULL,3,'[]','"Jakarta"','2026-08-14 06:14:22');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(299,19,'essay','<p>Jelaskan proses terjadinya hujan! (Esai)</p>',5,1,NULL,NULL,3,'[]','""','2026-08-14 06:14:22');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(300,19,'pilihan_ganda','<p>Perhatikan pernyataan berikut! (Pernyataan Bersusun)</p><p>1. Memiliki akar serabut</p><p>2. Tulang daun menyirip</p><p>3. Batang tidak bercabang</p><p>Ciri-ciri tumbuhan monokotil ditunjukkan oleh nomor...</p>',6,1,NULL,NULL,3,'["1 dan 2","1 dan 3","2 dan 3"]','"B"','2026-08-14 06:14:22');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(312,19,'menjodohkan','Pasangkan setiap konsep/pernyataan pada <b data-path-to-node="3" data-index-in-node="40">Kolom Kiri</b>&nbsp;dengan istilah atau jawaban yang tepat pada <b data-path-to-node="3" data-index-in-node="92">Kolom Kanan</b>!',7,1,NULL,NULL,3,'{"left":["Peristiwa perubahan wujud zat dari gas menjadi cair","Satuan internasional (SI) untuk besaran suhu","Organel sel tumbuhan yang berfungsi sebagai tempat berlangsungnya fotosintesis","Hubungan timbal balik antara dua makhluk hidup yang saling menguntungkan"],"right":["Klorofil","Mengembun","Kelvin","Simbiosis Mutualisme","Kloroplas","Simbiosis Komensalisme"]}','{"0":"1","1":"2","2":"4","3":"3"}','2026-08-18 01:18:15');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(313,19,'benar_salah','adkalhfwhkhk',8,1,NULL,NULL,3,'["Benar","Salah"]','"Benar"','2026-08-18 01:20:00');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(314,19,'benar_salah','Jawab pertanyaan berikut?',9,1,NULL,NULL,3,'{"statements":["Hasil dari $5 + 3 \\times 2$ adalah $16$.","Hasil pengurangan bilangan bulat $-8 - (-5)$ sama dengan $-3$.","Nilai dari $25\\%$ dari $80$ adalah $20$."]}','{"0":"Salah","1":"Benar","2":"Benar"}','2026-08-18 01:32:26');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(315,19,'pilihan_ganda','<div><img alt="curah hujan" src="https://res.cloudinary.com/dfhtjgwcz/image/upload/v1787070382/ujian-madrasah/media/tbwawht9aaofooloo1l7.jpg">Perhatikan peta berikut!</div><p>Jika kalian perhatikan peta sebaran hujan di Indonesia, maka pernyataan yang benar berdasarkan informasi dari peta di atas adalah …</p>',10,1,NULL,NULL,3,'["Umumnya curah hujan sangat besar di daerah pantai","Semua wilayah di Indonesia curah hujannya sangat tinggi","Umumnya, pulau bagian barat curah hujannya lebih tinggi dari bagian timur  ","Wilayah Aceh, Jawa, dan Papua bagian tengah memiliki curah hujan tertinggi"]','"B"','2026-08-18 16:26:26');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(316,19,'pilihan_ganda','<div>Kondisi penyebaran sumber daya alam yang tidak merata menyebabkan ketersediaan barang juga tidak merata antardaerah satu dengan daerah yang lain. Hal ini merupakan salah satu faktor penyebab munculnya ... </div>',11,1,NULL,NULL,3,'["Keterbelakangan","Kelangkaan","Kemiskinan","Kesenjangan"]','"B"','2026-08-18 16:26:26');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(317,19,'pilihan_ganda','<div>Perhatikan gambar hutan <em>Mangrove</em> berikut!</div><p><img alt="C:\Users\LAPTOP\Downloads\WhatsApp Image 2019-02-14 at 08.26.20.jpeg" src="https://res.cloudinary.com/dfhtjgwcz/image/upload/v1787070385/ujian-madrasah/media/kufsorolvafmox3vfwuh.jpg"></p><p>Hutan <em>Mangrove</em> (hutan bakau) adalah tipe hutan yang berada didaerah pasang surut air laut. Maka fungsi hutan <em>Mangrove</em> adalah....</p>',12,1,NULL,NULL,3,'["Untuk pertumbuhan terumbu karang","Untuk pengembangbiakan berbagai jenis ikan","Menjaga kestabilan garis pantai","Sebagai tempat penangkapan ikan."]','"C"','2026-08-18 16:26:26');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(318,19,'pilihan_ganda','<div>Perhatikan kumpulan bilangan -5, -3, -1, -6, -4, -8. Urutan bilangan dari yang terkecil hingga yang terbesar adalah…</div>',13,1,NULL,NULL,3,'["-8, -6, -5, -4, -3, -1","-1, -3, -4, -5, -6, -8","-8,-6, -4, -5, -3, -1","-1, -3, -5, -6, -4, -8"]','"A"','2026-08-18 16:26:26');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(319,19,'pilihan_ganda','<div>Hasil dari -134×5+46-(-98) adalah…</div>',14,1,NULL,NULL,3,'["-632","-526","-556","-772"]','"B"','2026-08-18 16:26:26');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(320,23,'pilihan_ganda','<p>Siapa penemu bola lampu pijar?</p>',1,1,NULL,NULL,3,'["Thomas Alfa Edison","Alexander Graham Bell","Nikola Tesla","Albert Einstein"]','"A"','2026-08-22 06:04:57');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(321,23,'pilihan_ganda_kompleks','<p>Manakah dari hewan berikut yang termasuk mamalia? (Pilihan Ganda Kompleks)</p>',2,1,NULL,NULL,3,'["Kucing","Ayam","Paus","Katak"]','["A","C"]','2026-08-22 06:04:57');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(322,23,'benar_salah','<p>Matahari terbit dari sebelah barat. (Benar/Salah)</p>',3,1,NULL,NULL,3,'["Benar","Salah"]','"Salah"','2026-08-22 06:04:57');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(323,23,'isian_singkat','<p>Ibukota negara Indonesia adalah ... (Isian Singkat)</p>',4,1,NULL,NULL,3,'[]','"Jakarta"','2026-08-22 06:04:57');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(324,23,'essay','<p>Jelaskan proses terjadinya hujan! (Esai)</p>',5,1,NULL,NULL,3,'[]','""','2026-08-22 06:04:57');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(325,23,'pilihan_ganda','<p>Perhatikan pernyataan berikut! (Pernyataan Bersusun)</p><p>1. Memiliki akar serabut</p><p>2. Tulang daun menyirip</p><p>3. Batang tidak bercabang</p><p>Ciri-ciri tumbuhan monokotil ditunjukkan oleh nomor...</p>',6,1,NULL,NULL,3,'["1 dan 2","1 dan 3","2 dan 3"]','"B"','2026-08-22 06:04:57');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(326,23,'menjodohkan','Pasangkan setiap konsep/pernyataan pada <b data-path-to-node="3" data-index-in-node="40">Kolom Kiri</b>&nbsp;dengan istilah atau jawaban yang tepat pada <b data-path-to-node="3" data-index-in-node="92">Kolom Kanan</b>!',7,1,NULL,NULL,3,'{"left":["Peristiwa perubahan wujud zat dari gas menjadi cair","Satuan internasional (SI) untuk besaran suhu","Organel sel tumbuhan yang berfungsi sebagai tempat berlangsungnya fotosintesis","Hubungan timbal balik antara dua makhluk hidup yang saling menguntungkan"],"right":["Klorofil","Mengembun","Kelvin","Simbiosis Mutualisme","Kloroplas","Simbiosis Komensalisme"]}','{"0":"1","1":"2","2":"4","3":"3"}','2026-08-22 06:04:57');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(327,23,'benar_salah','adkalhfwhkhk',8,1,NULL,NULL,3,'["Benar","Salah"]','"Benar"','2026-08-22 06:04:57');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(328,23,'benar_salah','Jawab pertanyaan berikut?',9,1,NULL,NULL,3,'{"statements":["Hasil dari $5 + 3 \\times 2$ adalah $16$.","Hasil pengurangan bilangan bulat $-8 - (-5)$ sama dengan $-3$.","Nilai dari $25\\%$ dari $80$ adalah $20$."]}','{"0":"Salah","1":"Benar","2":"Benar"}','2026-08-22 06:04:57');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(329,23,'pilihan_ganda','<div><img alt="curah hujan" src="https://res.cloudinary.com/dfhtjgwcz/image/upload/v1787070382/ujian-madrasah/media/tbwawht9aaofooloo1l7.jpg">Perhatikan peta berikut!</div><p>Jika kalian perhatikan peta sebaran hujan di Indonesia, maka pernyataan yang benar berdasarkan informasi dari peta di atas adalah …</p>',10,1,NULL,NULL,3,'["Umumnya curah hujan sangat besar di daerah pantai","Semua wilayah di Indonesia curah hujannya sangat tinggi","Umumnya, pulau bagian barat curah hujannya lebih tinggi dari bagian timur  ","Wilayah Aceh, Jawa, dan Papua bagian tengah memiliki curah hujan tertinggi"]','"B"','2026-08-22 06:04:57');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(330,23,'pilihan_ganda','<div>Kondisi penyebaran sumber daya alam yang tidak merata menyebabkan ketersediaan barang juga tidak merata antardaerah satu dengan daerah yang lain. Hal ini merupakan salah satu faktor penyebab munculnya ... </div>',11,1,NULL,NULL,3,'["Keterbelakangan","Kelangkaan","Kemiskinan","Kesenjangan"]','"B"','2026-08-22 06:04:57');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(331,23,'pilihan_ganda','<div>Perhatikan gambar hutan <em>Mangrove</em> berikut!</div><p><img alt="C:\Users\LAPTOP\Downloads\WhatsApp Image 2019-02-14 at 08.26.20.jpeg" src="https://res.cloudinary.com/dfhtjgwcz/image/upload/v1787070385/ujian-madrasah/media/kufsorolvafmox3vfwuh.jpg"></p><p>Hutan <em>Mangrove</em> (hutan bakau) adalah tipe hutan yang berada didaerah pasang surut air laut. Maka fungsi hutan <em>Mangrove</em> adalah....</p>',12,1,NULL,NULL,3,'["Untuk pertumbuhan terumbu karang","Untuk pengembangbiakan berbagai jenis ikan","Menjaga kestabilan garis pantai","Sebagai tempat penangkapan ikan."]','"C"','2026-08-22 06:04:57');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(332,23,'pilihan_ganda','<div>Perhatikan kumpulan bilangan -5, -3, -1, -6, -4, -8. Urutan bilangan dari yang terkecil hingga yang terbesar adalah…</div>',13,1,NULL,NULL,3,'["-8, -6, -5, -4, -3, -1","-1, -3, -4, -5, -6, -8","-8,-6, -4, -5, -3, -1","-1, -3, -5, -6, -4, -8"]','"A"','2026-08-22 06:04:57');
INSERT INTO "questions" ("id","exam_id","type","question_text","question_number","points","media_type","media_url","audio_max_plays","options_json","correct_answer_json","created_at") VALUES(333,23,'pilihan_ganda','<div>Hasil dari -134×5+46-(-98) adalah…</div>',14,1,NULL,NULL,3,'["-632","-526","-556","-772"]','"B"','2026-08-22 06:04:57');
CREATE TABLE tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    token_code TEXT NOT NULL UNIQUE,
    is_released INTEGER NOT NULL DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL
, released_at TEXT, session_number INTEGER DEFAULT 1);
INSERT INTO "tokens" ("id","school_id","exam_id","token_code","is_released","created_by","created_at","expires_at","released_at","session_number") VALUES(76,2,19,'57PQTB',1,18,'2026-08-18 02:53:27','2026-08-18T04:53:27.342Z','2026-08-18 02:53:27',1);
INSERT INTO "tokens" ("id","school_id","exam_id","token_code","is_released","created_by","created_at","expires_at","released_at","session_number") VALUES(77,2,19,'2WBXBK',1,18,'2026-08-18 16:32:02','2026-08-18T18:32:02.512Z','2026-08-18 17:37:40',1);
INSERT INTO "tokens" ("id","school_id","exam_id","token_code","is_released","created_by","created_at","expires_at","released_at","session_number") VALUES(78,2,23,'TJQT8Y',1,18,'2026-08-22 06:05:20','2026-08-22T08:05:20.583Z','2026-08-22 06:22:55',1);
CREATE TABLE exam_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')), room_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL, session_number INTEGER DEFAULT NULL,
    UNIQUE(exam_id, student_id)
);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(103,19,51,'2026-08-13 04:24:35',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(104,19,57,'2026-08-13 04:24:35',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(105,19,58,'2026-08-13 04:24:35',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(106,19,59,'2026-08-13 04:24:35',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(107,19,73,'2026-08-13 04:24:35',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(108,19,74,'2026-08-13 04:24:35',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(109,19,81,'2026-08-13 04:24:35',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(110,19,86,'2026-08-13 04:24:35',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(111,19,87,'2026-08-13 04:24:35',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(112,20,48,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(113,20,49,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(114,20,50,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(115,20,53,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(116,20,56,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(117,20,60,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(118,20,62,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(119,20,64,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(120,20,65,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(121,20,68,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(122,20,71,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(123,20,72,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(124,20,75,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(125,20,76,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(126,20,79,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(127,20,83,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(128,20,84,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(129,20,85,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(130,20,88,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(131,20,89,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(132,20,90,'2026-08-14 12:19:05',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(133,21,48,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(134,21,49,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(135,21,50,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(136,21,53,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(137,21,56,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(138,21,60,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(139,21,62,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(140,21,64,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(141,21,65,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(142,21,68,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(143,21,71,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(144,21,72,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(145,21,75,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(146,21,76,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(147,21,79,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(148,21,83,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(149,21,84,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(150,21,85,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(151,21,88,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(152,21,89,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(153,21,90,'2026-08-15 03:44:12',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(154,23,51,'2026-08-15 13:43:39',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(155,23,57,'2026-08-15 13:43:39',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(156,23,58,'2026-08-15 13:43:39',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(157,23,59,'2026-08-15 13:43:39',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(158,23,73,'2026-08-15 13:43:39',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(159,23,74,'2026-08-15 13:43:39',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(160,23,81,'2026-08-15 13:43:39',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(161,23,86,'2026-08-15 13:43:39',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(162,23,87,'2026-08-15 13:43:39',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(163,24,51,'2026-08-15 13:48:07',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(164,24,57,'2026-08-15 13:48:07',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(165,24,58,'2026-08-15 13:48:07',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(166,24,59,'2026-08-15 13:48:07',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(167,24,73,'2026-08-15 13:48:07',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(168,24,74,'2026-08-15 13:48:07',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(169,24,81,'2026-08-15 13:48:07',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(170,24,86,'2026-08-15 13:48:07',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(171,24,87,'2026-08-15 13:48:07',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(172,25,48,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(173,25,49,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(174,25,50,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(175,25,53,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(176,25,56,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(177,25,60,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(178,25,62,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(179,25,64,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(180,25,65,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(181,25,68,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(182,25,71,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(183,25,72,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(184,25,75,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(185,25,76,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(186,25,79,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(187,25,83,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(188,25,84,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(189,25,85,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(190,25,88,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(191,25,89,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(192,25,90,'2026-08-17 13:50:32',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(193,26,48,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(194,26,49,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(195,26,50,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(196,26,53,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(197,26,56,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(198,26,60,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(199,26,62,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(200,26,64,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(201,26,65,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(202,26,68,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(203,26,71,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(204,26,72,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(205,26,75,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(206,26,76,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(207,26,79,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(208,26,83,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(209,26,84,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(210,26,85,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(211,26,88,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(212,26,89,'2026-08-17 14:06:22',NULL,NULL);
INSERT INTO "exam_participants" ("id","exam_id","student_id","created_at","room_id","session_number") VALUES(213,26,90,'2026-08-17 14:06:22',NULL,NULL);
CREATE TABLE exam_teachers (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	exam_id INTEGER NOT NULL,
	teacher_id INTEGER NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, room_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL,
	FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
	FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
	UNIQUE(exam_id, teacher_id)
);
INSERT INTO "exam_teachers" ("id","exam_id","teacher_id","created_at","room_id") VALUES(16,19,92,'2026-08-14 14:53:46',NULL);
INSERT INTO "exam_teachers" ("id","exam_id","teacher_id","created_at","room_id") VALUES(17,19,99,'2026-08-17 01:16:18',NULL);
INSERT INTO "exam_teachers" ("id","exam_id","teacher_id","created_at","room_id") VALUES(18,19,91,'2026-08-17 19:27:39',NULL);
INSERT INTO "exam_teachers" ("id","exam_id","teacher_id","created_at","room_id") VALUES(19,19,93,'2026-08-17 19:27:39',NULL);
CREATE TABLE exam_proctors (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	exam_id INTEGER NOT NULL,
	proctor_id INTEGER NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, room_id INTEGER REFERENCES exam_rooms(id) ON DELETE SET NULL, sessions TEXT, proctor_role TEXT DEFAULT 'p1',
	FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
	FOREIGN KEY (proctor_id) REFERENCES users(id) ON DELETE CASCADE,
	UNIQUE(exam_id, proctor_id)
);
INSERT INTO "exam_proctors" ("id","exam_id","proctor_id","created_at","room_id","sessions","proctor_role") VALUES(25,20,91,'2026-08-14 12:19:33',NULL,NULL,'p1');
INSERT INTO "exam_proctors" ("id","exam_id","proctor_id","created_at","room_id","sessions","proctor_role") VALUES(26,20,92,'2026-08-14 12:19:33',NULL,NULL,'p2');
INSERT INTO "exam_proctors" ("id","exam_id","proctor_id","created_at","room_id","sessions","proctor_role") VALUES(36,21,95,'2026-08-15 04:02:31',NULL,NULL,'p1');
INSERT INTO "exam_proctors" ("id","exam_id","proctor_id","created_at","room_id","sessions","proctor_role") VALUES(37,21,96,'2026-08-15 04:02:31',NULL,NULL,'p1');
INSERT INTO "exam_proctors" ("id","exam_id","proctor_id","created_at","room_id","sessions","proctor_role") VALUES(38,5,30,'2026-08-15 04:05:21',NULL,NULL,'pt');
INSERT INTO "exam_proctors" ("id","exam_id","proctor_id","created_at","room_id","sessions","proctor_role") VALUES(39,19,35,'2026-08-15 13:26:59',NULL,NULL,'p2');
INSERT INTO "exam_proctors" ("id","exam_id","proctor_id","created_at","room_id","sessions","proctor_role") VALUES(41,19,99,'2026-08-18 00:15:29',NULL,NULL,'p1');
CREATE TABLE student_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL REFERENCES users(id),
    exam_id INTEGER NOT NULL REFERENCES exams(id),
    token_id INTEGER REFERENCES tokens(id),
    start_time TEXT NOT NULL DEFAULT (datetime('now')),
    end_time TEXT,
    submit_time TEXT,
    score REAL,
    total_points INTEGER,
    status TEXT NOT NULL DEFAULT 'mengerjakan' CHECK(status IN ('mengerjakan', 'selesai', 'waktu_habis')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
, violation_count INTEGER DEFAULT 0, violation_logs TEXT, objective_score REAL DEFAULT 0, is_paused INTEGER NOT NULL DEFAULT 0, paused_at TEXT, signature TEXT, is_graded INTEGER DEFAULT 0, is_score_released INTEGER DEFAULT 0, updated_at TEXT);
INSERT INTO "student_attempts" ("id","student_id","exam_id","token_id","start_time","end_time","submit_time","score","total_points","status","created_at","violation_count","violation_logs","objective_score","is_paused","paused_at","signature","is_graded","is_score_released","updated_at") VALUES(63,57,19,76,'2026-08-18 02:53:50','2026-08-18T03:53:50.800Z','2026-08-18 02:57:30',100,8,'selesai','2026-08-18 02:53:50',0,'[]',0,0,NULL,'https://res.cloudinary.com/dfhtjgwcz/image/upload/v1787021631/ujian_signatures/mix6cprw58nfaujbxjn3.png',1,1,'2026-08-18 02:53:50');
INSERT INTO "student_attempts" ("id","student_id","exam_id","token_id","start_time","end_time","submit_time","score","total_points","status","created_at","violation_count","violation_logs","objective_score","is_paused","paused_at","signature","is_graded","is_score_released","updated_at") VALUES(66,86,19,77,'2026-08-18 17:14:23','2026-08-18T18:14:23.644Z','2026-08-18 17:17:18',52.4,14,'selesai','2026-08-18 17:14:23',0,'[]',0,0,NULL,'https://res.cloudinary.com/dfhtjgwcz/image/upload/v1787073264/ujian_signatures/ji23lbsr4thskc8zfmde.png',1,1,'2026-08-18 17:14:23');
INSERT INTO "student_attempts" ("id","student_id","exam_id","token_id","start_time","end_time","submit_time","score","total_points","status","created_at","violation_count","violation_logs","objective_score","is_paused","paused_at","signature","is_graded","is_score_released","updated_at") VALUES(67,81,19,77,'2026-08-18 17:38:03','2026-08-18T18:38:03.784Z','2026-08-18 17:39:36',68.4,14,'selesai','2026-08-18 17:38:03',0,'[]',0,0,NULL,'https://res.cloudinary.com/dfhtjgwcz/image/upload/v1787074685/ujian_signatures/trr2zcbtcanp6xdvgcxg.png',1,1,'2026-08-18 17:38:03');
INSERT INTO "student_attempts" ("id","student_id","exam_id","token_id","start_time","end_time","submit_time","score","total_points","status","created_at","violation_count","violation_logs","objective_score","is_paused","paused_at","signature","is_graded","is_score_released","updated_at") VALUES(68,57,23,78,'2026-08-22 06:05:38','2026-08-22T07:05:38.392Z','2026-08-22 06:09:50',30.9,14,'selesai','2026-08-22 06:05:38',0,'[]',0,0,NULL,'https://res.cloudinary.com/dfhtjgwcz/image/upload/v1787378739/ujian_signatures/qa4vzamanjlwmugawivw.png',0,0,'2026-08-22 06:05:38');
INSERT INTO "student_attempts" ("id","student_id","exam_id","token_id","start_time","end_time","submit_time","score","total_points","status","created_at","violation_count","violation_logs","objective_score","is_paused","paused_at","signature","is_graded","is_score_released","updated_at") VALUES(69,58,23,78,'2026-08-22 06:23:11','2026-08-22T07:23:11.152Z','2026-08-22 06:24:55',37.5,14,'selesai','2026-08-22 06:23:11',4,'[{"time":1787379834160,"type":"Keluar dari aplikasi ujian (Berpindah Tab/Layar)"},{"time":1787379847937,"type":"Keluar dari aplikasi ujian (Berpindah Tab/Layar)"},{"time":1787379862568,"type":"Keluar dari Layar Penuh"},{"time":1787379894462,"type":"Keluar dari Layar Penuh"}]',0,0,NULL,'https://res.cloudinary.com/dfhtjgwcz/image/upload/v1787379792/ujian_signatures/zkpfqu7t5ujof0onucyt.png',0,0,'2026-08-22 06:24:55');
CREATE TABLE student_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attempt_id INTEGER NOT NULL REFERENCES student_attempts(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(id),
    answer_given TEXT,
    score_given REAL,
    is_correct INTEGER,
    is_doubted INTEGER NOT NULL DEFAULT 0,
    answered_at TEXT DEFAULT (datetime('now'))
);
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(1358,63,298,'Jakarta',1,1,0,'2026-08-18 02:57:25');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(1360,63,314,'{"0":"Salah","1":"Benar","2":"Benar"}',1,1,0,'2026-08-18 02:57:25');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(1362,63,299,'Hujan terjadi karena ......',1,1,0,'2026-08-18 02:57:25');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(1364,63,297,'Salah',1,1,0,'2026-08-18 02:57:25');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(1376,63,296,'["A","C"]',1,1,0,'2026-08-18 02:57:25');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(1381,63,295,'A',1,1,0,'2026-08-18 02:57:25');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(1392,63,312,'{"0":"1","1":"2","2":"4","3":"3"}',1,1,0,'2026-08-18 02:57:25');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(1420,63,300,'B',1,1,0,'2026-08-18 02:57:25');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2151,66,313,'Benar',1,1,0,'2026-08-18 17:17:16');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2152,66,315,'C',0,0,0,'2026-08-18 17:17:16');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2155,66,312,'{"0":"1","1":"2","2":"0","3":"5"}',0.5,0,0,'2026-08-18 17:17:16');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2164,66,298,'cssv',1,1,0,'2026-08-18 17:17:16');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2169,66,299,'fswbehe',1,1,0,'2026-08-18 17:17:16');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2175,66,300,'B',1,1,0,'2026-08-18 17:17:16');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2191,66,319,'C',0,0,0,'2026-08-18 17:17:16');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2205,66,318,'B',0,0,0,'2026-08-18 17:17:16');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2215,66,295,'A',1,1,0,'2026-08-18 17:17:16');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2225,66,297,'Salah',1,1,0,'2026-08-18 17:17:16');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2245,66,296,'["B","A","C"]',0.5,0,0,'2026-08-18 17:17:16');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2264,66,317,'B',0,0,0,'2026-08-18 17:17:16');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2287,66,314,'{"0":"Benar","1":"Salah","2":"Benar"}',0.33,0,0,'2026-08-18 17:17:16');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2289,66,316,'A',0,0,0,'2026-08-18 17:17:16');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2349,67,295,'A',1,1,0,'2026-08-18 17:39:35');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2350,67,296,'["C","A"]',1,1,0,'2026-08-18 17:39:35');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2351,67,297,'Salah',1,1,0,'2026-08-18 17:39:35');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2352,67,298,'jakarta',1,1,0,'2026-08-18 17:39:35');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2353,67,299,'terjadinya pertumbukan dua awan yang mengakibatkan turunnya hujan dan ada kilat juga keren luar biasa.',1,1,0,'2026-08-18 17:39:35');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2354,67,300,'A',0,0,0,'2026-08-18 17:39:35');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2355,67,312,'{"0":"1","1":"4","2":"0","3":"2"}',0.25,0,0,'2026-08-18 17:39:35');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2356,67,313,'Benar',1,1,0,'2026-08-18 17:39:35');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2357,67,314,'{"0":"Benar","1":"Salah","2":"Benar"}',0.33,0,0,'2026-08-18 17:39:35');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2358,67,315,'B',1,1,0,'2026-08-18 17:39:35');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2359,67,316,'B',1,1,0,'2026-08-18 17:39:35');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2360,67,317,'C',1,1,0,'2026-08-18 17:39:35');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2361,67,318,'C',0,0,0,'2026-08-18 17:39:35');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2362,67,319,'A',0,0,0,'2026-08-18 17:39:35');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2629,68,320,'A',1,1,0,'2026-08-22 06:09:48');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2630,68,321,'',0,0,0,'2026-08-22 06:09:48');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2631,68,322,'Salah',1,1,0,'2026-08-22 06:09:48');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2632,68,323,'',0,0,0,'2026-08-22 06:09:48');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2633,68,324,replace('ndndnsnd\n','\n',char(10)),NULL,NULL,0,'2026-08-22 06:09:48');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2634,68,325,'A',0,0,0,'2026-08-22 06:09:48');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2635,68,326,'{"0":"4","1":"0","2":"3","3":"1"}',0,0,0,'2026-08-22 06:09:48');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2636,68,327,'Salah',0,0,0,'2026-08-22 06:09:48');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2637,68,328,'{"0":"Benar","1":"Salah","2":"Benar"}',0.33,0,0,'2026-08-22 06:09:48');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2638,68,329,'',0,0,0,'2026-08-22 06:09:48');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2639,68,330,'B',1,1,0,'2026-08-22 06:09:48');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2640,68,331,'B',0,0,0,'2026-08-22 06:09:48');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2641,68,332,'A',1,1,0,'2026-08-22 06:09:48');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2642,68,333,'',0,0,0,'2026-08-22 06:09:48');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2881,69,325,'A',0,0,0,'2026-08-22 06:24:55');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2882,69,320,'A',1,1,0,'2026-08-22 06:24:55');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2883,69,321,'["A","C"]',1,1,0,'2026-08-22 06:24:55');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2884,69,322,'Salah',1,1,0,'2026-08-22 06:24:55');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2885,69,323,'htr',NULL,NULL,0,'2026-08-22 06:24:55');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2886,69,324,'nxnxnzxnxnx',NULL,NULL,0,'2026-08-22 06:24:55');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2888,69,326,'{"0":"4","1":"0","2":"5","3":"3"}',0.25,0,0,'2026-08-22 06:24:55');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2889,69,327,'Salah',0,0,0,'2026-08-22 06:24:55');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2890,69,328,'{"0":"Benar"}',0,0,0,'2026-08-22 06:24:55');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2891,69,329,'B',1,1,0,'2026-08-22 06:24:55');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2892,69,330,'B',1,1,0,'2026-08-22 06:24:55');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2893,69,331,'B',0,0,0,'2026-08-22 06:24:55');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2894,69,332,'B',0,0,0,'2026-08-22 06:24:55');
INSERT INTO "student_answers" ("id","attempt_id","question_id","answer_given","score_given","is_correct","is_doubted","answered_at") VALUES(2895,69,333,'A',0,0,0,'2026-08-22 06:24:55');
CREATE TABLE uploaded_media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL UNIQUE,
    media_type TEXT NOT NULL CHECK(media_type IN ('image', 'audio')),
    uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
, uploaded_by INTEGER REFERENCES users(id), is_public INTEGER NOT NULL DEFAULT 0, name TEXT, school_id INTEGER REFERENCES schools(id));
INSERT INTO "uploaded_media" ("id","url","media_type","uploaded_at","uploaded_by","is_public","name","school_id") VALUES(5,'https://res.cloudinary.com/dfhtjgwcz/image/upload/v1785749539/y898h4hoq9ujyxzv98za.png','image','2026-08-03 09:32:20',NULL,0,'qr',NULL);
INSERT INTO "uploaded_media" ("id","url","media_type","uploaded_at","uploaded_by","is_public","name","school_id") VALUES(6,'https://res.cloudinary.com/dfhtjgwcz/video/upload/v1785750312/iv7gf9j2b8nukoxijdf8.mp3','audio','2026-08-03 09:45:13',NULL,0,NULL,NULL);
INSERT INTO "uploaded_media" ("id","url","media_type","uploaded_at","uploaded_by","is_public","name","school_id") VALUES(270,'https://res.cloudinary.com/dfhtjgwcz/image/upload/v1786356409/ujian-madrasah/school/ennhivenpjhtkslyts6g.png','image','2026-08-10 10:06:49',18,0,'ennhivenpjhtkslyts6g.png',2);
INSERT INTO "uploaded_media" ("id","url","media_type","uploaded_at","uploaded_by","is_public","name","school_id") VALUES(271,'https://res.cloudinary.com/dfhtjgwcz/image/upload/v1786356419/ujian-madrasah/students/f5ewvh3h4qqhm0sye8ak.jpg','image','2026-08-10 10:07:00',18,0,'Foto Siswa',2);
INSERT INTO "uploaded_media" ("id","url","media_type","uploaded_at","uploaded_by","is_public","name","school_id") VALUES(272,'https://res.cloudinary.com/dfhtjgwcz/image/upload/v1786709853/ujian-madrasah/media/dyhoenpf1pgivrts8bx3.jpg','image','2026-08-14 12:17:35',18,0,'Gambar Import Word',2);
INSERT INTO "uploaded_media" ("id","url","media_type","uploaded_at","uploaded_by","is_public","name","school_id") VALUES(273,'https://res.cloudinary.com/dfhtjgwcz/image/upload/v1786709854/ujian-madrasah/media/uem513mwj0wdumrifyob.jpg','image','2026-08-14 12:17:35',18,0,'Gambar Import Word',2);
INSERT INTO "uploaded_media" ("id","url","media_type","uploaded_at","uploaded_by","is_public","name","school_id") VALUES(274,'https://res.cloudinary.com/dfhtjgwcz/image/upload/v1787070382/ujian-madrasah/media/tbwawht9aaofooloo1l7.jpg','image','2026-08-18 16:26:26',18,0,'Gambar Import Word',2);
INSERT INTO "uploaded_media" ("id","url","media_type","uploaded_at","uploaded_by","is_public","name","school_id") VALUES(275,'https://res.cloudinary.com/dfhtjgwcz/image/upload/v1787070385/ujian-madrasah/media/kufsorolvafmox3vfwuh.jpg','image','2026-08-18 16:26:26',18,0,'Gambar Import Word',2);
CREATE TABLE exam_type_classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_type_id INTEGER NOT NULL REFERENCES exam_types(id) ON DELETE CASCADE,
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_type_id, class_id)
);
INSERT INTO "exam_type_classes" ("id","exam_type_id","class_id","created_at") VALUES(14,5,8,'2026-08-13 03:58:55');
INSERT INTO "exam_type_classes" ("id","exam_type_id","class_id","created_at") VALUES(15,5,5,'2026-08-13 04:23:29');
INSERT INTO "exam_type_classes" ("id","exam_type_id","class_id","created_at") VALUES(17,5,6,'2026-08-13 04:34:24');
INSERT INTO "exam_type_classes" ("id","exam_type_id","class_id","created_at") VALUES(18,1,1,'2026-08-15 04:04:53');
INSERT INTO "exam_type_classes" ("id","exam_type_id","class_id","created_at") VALUES(19,1,2,'2026-08-15 04:04:53');
CREATE TABLE exam_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL,
    start_time TEXT,
    end_time TEXT,
    UNIQUE(exam_id, session_number)
);
INSERT INTO "exam_sessions" ("id","exam_id","session_number","start_time","end_time") VALUES(13,21,1,'2026-08-15T11:43','2026-08-15T11:47');
INSERT INTO "exam_sessions" ("id","exam_id","session_number","start_time","end_time") VALUES(14,21,2,'2026-08-15T00:46','2026-08-15T00:49');
INSERT INTO "exam_sessions" ("id","exam_id","session_number","start_time","end_time") VALUES(23,24,1,'2026-08-15T21:50','2026-08-15T21:55');
INSERT INTO "exam_sessions" ("id","exam_id","session_number","start_time","end_time") VALUES(24,24,2,'2026-08-15T22:00','2026-08-15T22:10');
INSERT INTO "exam_sessions" ("id","exam_id","session_number","start_time","end_time") VALUES(25,24,3,'2026-08-15T22:40','2026-08-15T22:50');
CREATE TABLE exam_rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE exam_type_proctors (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				exam_type_id INTEGER NOT NULL,
				proctor_id INTEGER NOT NULL,
				proctor_role TEXT DEFAULT 'pt',
				UNIQUE(exam_type_id, proctor_id)
			);
INSERT INTO "exam_type_proctors" ("id","exam_type_id","proctor_id","proctor_role") VALUES(1,5,94,'pt');
INSERT INTO "exam_type_proctors" ("id","exam_type_id","proctor_id","proctor_role") VALUES(2,5,92,'cm');
INSERT INTO "exam_type_proctors" ("id","exam_type_id","proctor_id","proctor_role") VALUES(3,1,30,'pt');
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('schools',2);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('classes',9);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('subjects',29);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('users',100);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('exams',27);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('tokens',78);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('exam_participants',213);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('exam_proctors',41);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('exam_teachers',19);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('student_attempts',69);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('uploaded_media',275);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('exam_types',5);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('questions',333);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('student_answers',3150);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('exam_type_classes',19);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('exam_sessions',25);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('exam_rooms',6);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('exam_type_proctors',3);
CREATE INDEX idx_users_school ON users(school_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_exams_school ON exams(school_id);
CREATE INDEX idx_exams_active ON exams(is_active);
CREATE INDEX idx_tokens_exam ON tokens(exam_id);
CREATE INDEX idx_tokens_code ON tokens(token_code);
CREATE INDEX idx_attempts_student ON student_attempts(student_id);
CREATE INDEX idx_attempts_exam ON student_attempts(exam_id);
CREATE INDEX idx_attempts_status ON student_attempts(status);
CREATE INDEX idx_participants_exam ON exam_participants(exam_id);
CREATE INDEX idx_participants_student ON exam_participants(student_id);
CREATE INDEX idx_exam_participants_exam ON exam_participants(exam_id);
CREATE INDEX idx_exam_participants_student ON exam_participants(student_id);
CREATE INDEX idx_exam_teachers_exam ON exam_teachers(exam_id);
CREATE INDEX idx_exam_teachers_teacher ON exam_teachers(teacher_id);
CREATE INDEX idx_exam_proctors_exam ON exam_proctors(exam_id);
CREATE INDEX idx_exam_proctors_proctor ON exam_proctors(proctor_id);
CREATE INDEX idx_uploaded_media_url ON uploaded_media(url);
CREATE INDEX idx_exam_types_school ON exam_types(school_id);
CREATE INDEX idx_exam_types_active ON exam_types(is_active);
CREATE INDEX idx_uploaded_media_school ON uploaded_media(school_id);
CREATE INDEX idx_tokens_exam_school ON tokens(exam_id, school_id);
CREATE INDEX idx_questions_exam ON questions(exam_id);
CREATE INDEX idx_questions_type ON questions(type);
CREATE INDEX idx_attempts_exam_student ON student_attempts(exam_id, student_id);
CREATE INDEX idx_answers_attempt ON student_answers(attempt_id);
CREATE INDEX idx_answers_question ON student_answers(question_id);
CREATE INDEX idx_uploaded_media_school_public ON uploaded_media(school_id, is_public);
CREATE INDEX idx_exam_type_classes_type ON exam_type_classes(exam_type_id);
CREATE INDEX idx_exam_type_classes_class ON exam_type_classes(class_id);
CREATE INDEX idx_exam_rooms_exam ON exam_rooms(exam_id);
CREATE INDEX idx_classes_school ON classes(school_id);
CREATE INDEX idx_subjects_school ON subjects(school_id);
CREATE UNIQUE INDEX idx_answers_attempt_question ON student_answers(attempt_id, question_id);
CREATE INDEX idx_attempts_student_status ON student_attempts(student_id, status);
CREATE INDEX idx_exam_type_proctors_type ON exam_type_proctors(exam_type_id);
CREATE INDEX idx_exam_type_proctors_proctor ON exam_type_proctors(proctor_id);
CREATE INDEX idx_questions_exam_number ON questions(exam_id, question_number);
CREATE INDEX idx_users_username_active ON users(username, is_active);
