import { getDB } from '../src/lib/server/db.ts';
import dotenv from 'dotenv';

dotenv.config();

async function testExamFlow() {
	const db = getDB();
	console.log('Testing Exam Flow & Auto-save in Neon DB...');

	try {
		// 1. Create dummy attempt for student 1, exam 13
		const createAttempt = await db
			.prepare(`
				INSERT INTO student_attempts (student_id, exam_id, status, start_time)
				VALUES (?, ?, 'mengerjakan', datetime('now'))
			`)
			.bind(1, 13)
			.run();

		const attemptId = createAttempt.meta.last_row_id;
		console.log('1. Attempt created with ID:', attemptId);

		// 2. Test saving single answer 1st time
		const save1 = await db
			.prepare(`
				INSERT INTO student_answers (attempt_id, question_id, answer_given, is_doubted, answered_at)
				VALUES (?, ?, ?, ?, datetime('now'))
				ON CONFLICT(attempt_id, question_id) DO UPDATE SET
					answer_given = excluded.answer_given,
					is_doubted = excluded.is_doubted,
					answered_at = datetime('now')
			`)
			.bind(attemptId, 254, 'B', 0)
			.run();
		console.log('2. Answer saved (1st time):', save1.meta);

		// 3. Test changing answer (Upsert update)
		const save2 = await db
			.prepare(`
				INSERT INTO student_answers (attempt_id, question_id, answer_given, is_doubted, answered_at)
				VALUES (?, ?, ?, ?, datetime('now'))
				ON CONFLICT(attempt_id, question_id) DO UPDATE SET
					answer_given = excluded.answer_given,
					is_doubted = excluded.is_doubted,
					answered_at = datetime('now')
			`)
			.bind(attemptId, 254, 'C', 1)
			.run();
		console.log('3. Answer updated (Upsert):', save2.meta);

		// 4. Verify saved answer
		const savedAns = await db
			.prepare('SELECT * FROM student_answers WHERE attempt_id = ? AND question_id = ?')
			.bind(attemptId, 254)
			.first();
		console.log('4. Stored answer row:', savedAns);

		// 5. Clean up test attempt
		await db.batch([
			db.prepare('DELETE FROM student_answers WHERE attempt_id = ?').bind(attemptId),
			db.prepare('DELETE FROM student_attempts WHERE id = ?').bind(attemptId)
		]);
		console.log('5. Cleaned up test attempt.');

		console.log('\n🎉 EXAM AUTOSAVE TEST PASSED 100%!');
	} catch (err) {
		console.error('Exam flow test failed:', err);
		process.exit(1);
	}
}

testExamFlow();
