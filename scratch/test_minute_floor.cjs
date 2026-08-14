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
	
	// Convert all timestamps to floor minutes
	const startMin = Math.floor(startMs / 60000);
	const earliestMin = startMin - 15;
	const endMin = endMs !== null ? Math.floor(endMs / 60000) : null;

	const nowUtcMs = now.getTime();
	let offsetMs;
	if (typeof clientTzOffsetMinutes === 'number' && !isNaN(clientTzOffsetMinutes)) {
		offsetMs = -clientTzOffsetMinutes * 60 * 1000;
	} else {
		const localOffsetMins = now.getTimezoneOffset();
		offsetMs = localOffsetMins !== 0 ? -localOffsetMins * 60 * 1000 : 8 * 3600 * 1000;
	}

	const nowWallMin = Math.floor((nowUtcMs + offsetMs) / 60000);
	const tooEarly = nowWallMin < earliestMin;
	const tooLate = endMin !== null && nowWallMin > endMin;

	if (!tooEarly && !tooLate) return { allowed: true };

	const timeFormatted = startTimeStr.includes('T')
		? startTimeStr.split('T')[1].slice(0, 5)
		: startTimeStr.includes(' ')
		? startTimeStr.split(' ')[1].slice(0, 5)
		: startTimeStr;

	if (tooEarly) return { allowed: false, reason: 'too_early', timeFormatted: timeFormatted.replace(':', '.') };
	return { allowed: false, reason: 'too_late', timeFormatted: timeFormatted.replace(':', '.') };
}

// 14:04:30 WITA for 14:20 exam -> Should be BLOCKED
console.log('14:04:30 WITA:', checkSessionTimeWindow('2026-08-14T14:20', '2026-08-15T07:17', new Date('2026-08-14T06:04:30Z'), -480));

// 14:05:00 WITA for 14:20 exam -> Should be ALLOWED
console.log('14:05:00 WITA:', checkSessionTimeWindow('2026-08-14T14:20', '2026-08-15T07:17', new Date('2026-08-14T06:05:00Z'), -480));

// 14:05:45 WITA for 14:20 exam -> Should be ALLOWED
console.log('14:05:45 WITA:', checkSessionTimeWindow('2026-08-14T14:20', '2026-08-15T07:17', new Date('2026-08-14T06:05:45Z'), -480));
