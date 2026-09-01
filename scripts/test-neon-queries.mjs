import { getDB } from '../src/lib/server/db.ts';
import dotenv from 'dotenv';

dotenv.config();

async function testAdapter() {
	console.log('Testing Neon D1 Adapter...');
	const db = getDB();

	try {
		// 1. Test .all()
		console.log('\n1. Test .all()');
		const schools = await db.prepare('SELECT * FROM schools ORDER BY id ASC').all();
		console.log('Schools count:', schools.results.length);
		console.log('First school:', schools.results[0]?.name);

		// 2. Test .bind().first()
		console.log('\n2. Test .bind().first()');
		const user = await db
			.prepare('SELECT id, username, name, role FROM users WHERE username = ?')
			.bind('superadmin')
			.first();
		console.log('Superadmin user:', user);

		// 3. Test .bind().first(colName)
		console.log('\n3. Test .bind().first(colName)');
		const userName = await db
			.prepare('SELECT name FROM users WHERE username = ?')
			.bind('superadmin')
			.first('name');
		console.log('Superadmin name only:', userName);

		// 4. Test INSERT with auto RETURNING id and meta.last_row_id
		console.log('\n4. Test INSERT and meta.last_row_id');
		const insertRes = await db
			.prepare('INSERT INTO subjects (school_id, name, code) VALUES (?, ?, ?)')
			.bind(1, 'Mata Pelajaran Test Adapter', 'TEST_ADAPTER')
			.run();
		console.log('Insert result meta:', insertRes.meta);
		const newId = insertRes.meta.last_row_id;
		console.log('Generated ID:', newId);

		if (!newId) throw new Error('last_row_id was not captured!');

		// 5. Test UPDATE with meta.changes
		console.log('\n5. Test UPDATE and meta.changes');
		const updateRes = await db
			.prepare('UPDATE subjects SET name = ?, updated_at = datetime("now") WHERE id = ?')
			.bind('Mata Pelajaran Test Adapter (Updated)', newId)
			.run();
		console.log('Update result meta:', updateRes.meta);

		// 6. Test .raw()
		console.log('\n6. Test .raw()');
		const rawData = await db
			.prepare('SELECT id, name, code FROM subjects WHERE id = ?')
			.bind(newId)
			.raw();
		console.log('Raw data:', rawData);

		// 7. Test db.batch()
		console.log('\n7. Test db.batch()');
		const batchRes = await db.batch([
			db.prepare('UPDATE subjects SET code = ? WHERE id = ?').bind('BATCH_1', newId),
			db.prepare('DELETE FROM subjects WHERE id = ?').bind(newId)
		]);
		console.log('Batch results count:', batchRes.length);
		console.log('Batch 1 meta:', batchRes[0].meta);
		console.log('Batch 2 meta (Delete):', batchRes[1].meta);

		// 8. Verify clean up
		const checkDeleted = await db.prepare('SELECT * FROM subjects WHERE id = ?').bind(newId).first();
		console.log('Subject after delete (should be null):', checkDeleted);

		console.log('\n✅ ALL ADAPTER TESTS PASSED SUCCESSFULLY!');
	} catch (e) {
		console.error('Test failed:', e);
		process.exit(1);
	}
}

testAdapter();
