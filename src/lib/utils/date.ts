/**
 * Safely parses a date string, handling SQLite UTC datetime strings correctly.
 * SQLite returns "YYYY-MM-DD HH:MM:SS" which should be interpreted as UTC,
 * but browsers might interpret it as local time if the 'Z' is missing.
 */
export function parseDate(dateStr: any): Date {
    if (!dateStr) return new Date();
    
    // Handle timestamps (numbers or numeric strings)
    if (typeof dateStr === 'number' || (typeof dateStr === 'string' && /^\d+$/.test(dateStr))) {
        return new Date(Number(dateStr));
    }

    let str = String(dateStr);
    
    // Convert SQLite datetime string "2026-08-07 10:00:00" to "2026-08-07T10:00:00Z"
    if (str.includes(' ') && !str.includes('Z') && !str.includes('T')) {
        str = str.replace(' ', 'T') + 'Z';
        return new Date(str);
    } 
    // Handle local datetime strings "2026-08-07T10:00:00" from inputs (no Z, no offset)
    else if (str.includes('T') && !str.includes('Z') && !str.includes('+') && !str.includes('-')) {
        return parseLocalDate(str);
    }
    
    return new Date(str);
}

/**
 * Parses a local datetime string (e.g. "YYYY-MM-DDTHH:mm") into a Date object representing local wall-clock time.
 */
export function parseLocalDate(dateStr: any): Date {
    if (!dateStr) return new Date();
    if (dateStr instanceof Date) return dateStr;
    const str = String(dateStr);
    const match = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/);
    if (match) {
        const [, year, month, day, hour, minute, second] = match;
        return new Date(
            parseInt(year, 10),
            parseInt(month, 10) - 1,
            parseInt(day, 10),
            parseInt(hour, 10),
            parseInt(minute, 10),
            second ? parseInt(second, 10) : 0
        );
    }
    return new Date(str);
}

/**
 * Calculates epoch minutes from wall-clock components of a YYYY-MM-DD HH:mm string.
 */
export function getWallClockMinutes(dateStr: any): number | null {
    if (!dateStr) return null;
    const str = String(dateStr);
    const match = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[T\s](\d{1,2}):(\d{1,2})/);
    if (!match) return null;
    const [, year, month, day, hour, minute] = match;
    return Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10)) / 60000;
}

/**
 * Gets wall-clock minutes for current time in a given timezone (e.g. Asia/Makassar, Asia/Jakarta, Asia/Jayapura).
 */
export function getNowWallClockMinutes(now: Date = new Date(), timeZone?: string): number {
    try {
        const tz = timeZone || (typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Asia/Makassar');
        const str = now.toLocaleString('sv-SE', { timeZone: tz });
        const minutes = getWallClockMinutes(str);
        if (minutes !== null) return minutes;
    } catch (e) {}
    return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()) / 60000;
}

/**
 * Checks if current time is within 15 minutes before the exam session start time and before end time.
 * Multi-timezone aware across Indonesian timezones (WIB, WITA, WIT).
 */
export function checkSessionTimeWindow(startTimeStr: string | null, endTimeStr: string | null, now: Date = new Date()): { allowed: boolean; reason?: 'too_early' | 'too_late'; timeFormatted?: string } {
    if (!startTimeStr) return { allowed: true };

    const startMinutes = getWallClockMinutes(startTimeStr);
    if (startMinutes === null) return { allowed: true };

    const endMinutes = endTimeStr ? getWallClockMinutes(endTimeStr) : null;
    const earliestMinutes = startMinutes - 15;

    // Check across standard Indonesian timezones (Asia/Makassar WITA, Asia/Jakarta WIB, Asia/Jayapura WIT)
    const timezones = ['Asia/Makassar', 'Asia/Jakarta', 'Asia/Jayapura'];
    try {
        const systemTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (systemTz && !timezones.includes(systemTz)) timezones.unshift(systemTz);
    } catch (e) {}

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
