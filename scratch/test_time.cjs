const process = require('process');
process.env.TZ = 'UTC';

function getWallClockMinutes(dateStr) {
	if (!dateStr) return null;
	const str = String(dateStr);
	const match = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[T\s](\d{1,2}):(\d{1,2})/);
	if (!match) return null;
	const [, year, month, day, hour, minute] = match;
	return Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10)) / 60000;
}

function getNowWallClockMinutes(now, timeZone) {
	try {
		const str = now.toLocaleString('sv-SE', { timeZone });
		const minutes = getWallClockMinutes(str);
		if (minutes !== null) return minutes;
	} catch (e) {}
	return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()) / 60000;
}

function isWithin15MinutesBeforeSession(now, startTimeStr, endTimeStr) {
	if (!startTimeStr) return { allowed: true };
	const startMinutes = getWallClockMinutes(startTimeStr);
	if (startMinutes === null) return { allowed: true };
	const endMinutes = endTimeStr ? getWallClockMinutes(endTimeStr) : null;
	const earliestMinutes = startMinutes - 15;

	const timezones = ['Asia/Makassar', 'Asia/Jakarta', 'Asia/Jayapura'];
	let isTooEarly = false;
	let isTooLate = false;
	let isAllowed = false;

	for (const tz of timezones) {
		const nowMin = getNowWallClockMinutes(now, tz);
		const tooEarly = nowMin < earliestMinutes;
		const tooLate = endMinutes !== null && nowMin > endMinutes;

		if (!tooEarly && !tooLate) {
			isAllowed = true;
			break;
		}
		if (tooEarly) isTooEarly = true;
		if (tooLate) isTooLate = true;
	}

	if (isAllowed) return { allowed: true };

	const timeFormatted = startTimeStr.includes('T')
		? startTimeStr.split('T')[1].slice(0, 5)
		: startTimeStr.includes(' ')
		? startTimeStr.split(' ')[1].slice(0, 5)
		: startTimeStr;

	if (isTooEarly) return { allowed: false, reason: 'too_early', timeFormatted: timeFormatted.replace(':', '.') };
	return { allowed: false, reason: 'too_late', timeFormatted: timeFormatted.replace(':', '.') };
}

// Test 1: at 13:30 WITA (05:30 UTC) for 13:44 exam -> Should be ALLOWED
const now1 = new Date('2026-08-14T05:30:25.550Z');
console.log('Test 1 (05:30 UTC = 13:30 WITA):', isWithin15MinutesBeforeSession(now1, '2026-08-14T13:44', '2026-08-15T07:17'));

// Test 2: at 12:00 WITA (04:00 UTC) for 13:44 exam -> Should NOT be allowed (too early)
const now2 = new Date('2026-08-14T04:00:00.000Z');
console.log('Test 2 (04:00 UTC = 12:00 WITA):', isWithin15MinutesBeforeSession(now2, '2026-08-14T13:44', '2026-08-14T15:00'));

// Test 3: at 16:00 WITA (08:00 UTC) after 15:00 exam -> Should NOT be allowed (too late)
const now3 = new Date('2026-08-14T08:00:00.000Z');
console.log('Test 3 (08:00 UTC = 16:00 WITA):', isWithin15MinutesBeforeSession(now3, '2026-08-14T13:44', '2026-08-14T15:00'));
