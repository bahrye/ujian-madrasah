/**
 * Safely parses a date string, handling SQLite UTC datetime strings correctly.
 * SQLite returns "YYYY-MM-DD HH:MM:SS" which should be interpreted as UTC,
 * but browsers might interpret it as local time if the 'Z' is missing.
 */
export function parseDate(dateStr: any): Date {
    if (!dateStr) return new Date();
    let str = String(dateStr);
    
    // Convert SQLite datetime string "2026-08-07 10:00:00" to "2026-08-07T10:00:00Z"
    if (str.includes(' ') && !str.includes('Z') && !str.includes('T')) {
        str = str.replace(' ', 'T') + 'Z';
    } 
    // Handle "2026-08-07T10:00:00" without Z
    else if (str.includes('T') && !str.includes('Z') && !str.includes('+') && !str.includes('-')) {
        str = str + 'Z';
    }
    
    return new Date(str);
}
