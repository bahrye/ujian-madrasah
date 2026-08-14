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
 * Calculates UTC timestamp (in ms) from wall-clock components of a YYYY-MM-DD HH:mm string.
 */
export function getWallClockMs(dateStr: any): number | null {
    if (!dateStr) return null;
    const str = String(dateStr);
    const match = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[T\s](\d{1,2}):(\d{1,2})/);
    if (!match) return null;
    const [, year, month, day, hour, minute] = match;
    return Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10));
}

/**
 * Checks if current time is within 15 minutes before the exam session start time and before end time.
 * Minute-floor precision so minute 14:05 for a 14:20 exam is immediately allowed.
 */
export function checkSessionTimeWindow(
    startTimeStr: string | null, 
    endTimeStr: string | null, 
    now: Date = new Date(),
    clientTzOffsetMinutes?: number | null
): { allowed: boolean; reason?: 'too_early' | 'too_late'; timeFormatted?: string } {
    if (!startTimeStr) return { allowed: true };

    const startMs = getWallClockMs(startTimeStr);
    if (startMs === null) return { allowed: true };

    const endMs = endTimeStr ? getWallClockMs(endTimeStr) : null;
    
    // Compare in whole wall-clock minutes to prevent millisecond round-down issues
    const startMin = Math.floor(startMs / 60000);
    const earliestMin = startMin - 15;
    const endMin = endMs !== null ? Math.floor(endMs / 60000) : null;

    const nowUtcMs = now.getTime();
    
    let offsetMs: number;
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
