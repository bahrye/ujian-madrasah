function getWallClockMs(dateStr) {
	if (!dateStr) return null;
	const str = String(dateStr);
	const match = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[T\s](\d{1,2}):(\d{1,2})/);
	if (!match) return null;
	const [, year, month, day, hour, minute] = match;
	return Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10));
}

function checkSessionTimeWindow(startTimeStr, endTimeStr, now = new Date(), clientTzOffsetMinutes) {
	if (!startTimeStr) return { allowed: true };
	const startMs = getWallClockMs(startTimeStr);
	if (startMs === null) return { allowed: true };
	const endMs = endTimeStr ? getWallClockMs(endTimeStr) : null;
	const earliestMs = startMs - (15 * 60 * 1000);
	const nowUtcMs = now.getTime();

	let offsetMs;
	if (typeof clientTzOffsetMinutes === 'number' && !isNaN(clientTzOffsetMinutes)) {
		offsetMs = -clientTzOffsetMinutes * 60 * 1000;
	} else {
		const localOffsetMins = now.getTimezoneOffset();
		offsetMs = localOffsetMins !== 0 ? -localOffsetMins * 60 * 1000 : 8 * 3600 * 1000;
	}

	const nowWallMs = nowUtcMs + offsetMs;
	const tooEarly = nowWallMs < earliestMs;
	const tooLate = endMs !== null && nowWallMs > endMs;

	if (!tooEarly && !tooLate) return { allowed: true };

	const timeFormatted = startTimeStr.includes('T')
		? startTimeStr.split('T')[1].slice(0, 5)
		: startTimeStr.includes(' ')
		? startTimeStr.split(' ')[1].slice(0, 5)
		: startTimeStr;

	if (tooEarly) return { allowed: false, reason: 'too_early', timeFormatted: timeFormatted.replace(':', '.') };
	return { allowed: false, reason: 'too_late', timeFormatted: timeFormatted.replace(':', '.') };
}

console.log('Test 1 (WITA 13:55 for 14:15 exam):', checkSessionTimeWindow('2026-08-14T14:15', '2026-08-15T07:17', new Date('2026-08-14T05:55:00Z'), -480));
console.log('Test 2 (WITA 14:01 for 14:15 exam):', checkSessionTimeWindow('2026-08-14T14:15', '2026-08-15T07:17', new Date('2026-08-14T06:01:00Z'), -480));
console.log('Test 3 (WIB 13:55 for 14:15 exam):', checkSessionTimeWindow('2026-08-14T14:15', '2026-08-15T07:17', new Date('2026-08-14T06:55:00Z'), -420));
console.log('Test 4 (WIT 13:55 for 14:15 exam):', checkSessionTimeWindow('2026-08-14T14:15', '2026-08-15T07:17', new Date('2026-08-14T04:55:00Z'), -540));
