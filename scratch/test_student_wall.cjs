function getWallClockMs(dateStr, referenceDate = new Date()) {
	if (!dateStr) return null;
	const str = String(dateStr).trim();
	
	// Case A: Full date and time "YYYY-MM-DD HH:mm" or "YYYY-MM-DDTHH:mm"
	const matchFull = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[T\s](\d{1,2}):(\d{1,2})/);
	if (matchFull) {
		const [, year, month, day, hour, minute] = matchFull;
		return Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10));
	}

	// Case B: Time string only "HH:mm" (e.g. "14:20")
	const matchTimeOnly = str.match(/^(\d{1,2}):(\d{1,2})/);
	if (matchTimeOnly) {
		const [, hour, minute] = matchTimeOnly;
		return Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), referenceDate.getUTCDate(), parseInt(hour, 10), parseInt(minute, 10));
	}

	return null;
}

function isExamTimeValid(startTimeStr, endTimeStr, now = new Date(), clientTzOffsetMinutes) {
	let offsetMs;
	if (typeof clientTzOffsetMinutes === 'number' && !isNaN(clientTzOffsetMinutes)) {
		offsetMs = -clientTzOffsetMinutes * 60 * 1000;
	} else {
		const localOffsetMins = now.getTimezoneOffset();
		offsetMs = localOffsetMins !== 0 ? -localOffsetMins * 60 * 1000 : 8 * 3600 * 1000;
	}

	const nowWallDate = new Date(now.getTime() + offsetMs);
	const nowWallMin = Math.floor(nowWallDate.getTime() / 60000);

	let startMin = null;
	if (startTimeStr) {
		const startMs = getWallClockMs(startTimeStr, nowWallDate);
		if (startMs !== null) {
			startMin = Math.floor(startMs / 60000);
			if (nowWallMin < startMin) {
				return { allowed: false, reason: 'too_early' };
			}
		}
	}

	if (endTimeStr) {
		const endMs = getWallClockMs(endTimeStr, nowWallDate);
		if (endMs !== null) {
			let endMin = Math.floor(endMs / 60000);
			if (startMin !== null && !endTimeStr.includes('-') && !endTimeStr.includes('/')) {
				if (endMin <= startMin) {
					endMin += 24 * 60; // Add 1 day
				}
			}
			if (nowWallMin > endMin) {
				return { allowed: false, reason: 'too_late' };
			}
		}
	}

	return { allowed: true };
}

// Test Case 1: WITA 14:23 (06:23 UTC) for 14:20 to 07:17 exam
console.log('Test 1 (WITA 14:23 for 14:20-07:17 exam):', isExamTimeValid('14:20', '07:17', new Date('2026-08-14T06:23:00Z'), -480));

// Test Case 2: WITA 14:23 (06:23 UTC) for "2026-08-14 14:20" to "2026-08-15 07:17"
console.log('Test 2 (WITA 14:23 for full datetime):', isExamTimeValid('2026-08-14 14:20', '2026-08-15 07:17', new Date('2026-08-14T06:23:00Z'), -480));

// Test Case 3: WITA 14:04 (06:04 UTC) for 14:20 exam (Before start time)
console.log('Test 3 (WITA 14:04 for 14:20 exam):', isExamTimeValid('14:20', '07:17', new Date('2026-08-14T06:04:00Z'), -480));
