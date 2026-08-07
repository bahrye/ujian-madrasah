const sqlite3 = require('better-sqlite3');
const db = new sqlite3('.wrangler/state/v3/d1/miniflare-D1DatabaseObject/8a599dc2-7c8a-44d5-8664-df0a8fc257e8.sqlite');

try {
  const types = db.prepare('SELECT * FROM exam_type_participants').all();
  console.log('exam_type_participants:', types);
} catch (e) {
  console.log(e.message);
}

try {
  const parts = db.prepare('SELECT * FROM exam_participants').all();
  console.log('exam_participants:', parts);
} catch (e) {
  console.log(e.message);
}

try {
  const exams = db.prepare('SELECT id, title, exam_type_id FROM exams').all();
  console.log('exams:', exams);
} catch (e) {
  console.log(e.message);
}
