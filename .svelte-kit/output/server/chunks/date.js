function parseDate(dateStr) {
  if (!dateStr) return /* @__PURE__ */ new Date();
  if (typeof dateStr === "number" || typeof dateStr === "string" && /^\d+$/.test(dateStr)) {
    return new Date(Number(dateStr));
  }
  let str = String(dateStr);
  if (str.includes(" ") && !str.includes("Z") && !str.includes("T")) {
    str = str.replace(" ", "T") + "Z";
    return new Date(str);
  } else if (str.includes("T") && !str.includes("Z") && !str.includes("+") && !str.includes("-")) {
    return parseLocalDate(str);
  }
  return new Date(str);
}
function parseLocalDate(dateStr) {
  if (!dateStr) return /* @__PURE__ */ new Date();
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
function getWallClockMs(dateStr) {
  if (!dateStr) return null;
  const str = String(dateStr);
  const match = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[T\s](\d{1,2}):(\d{1,2})/);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match;
  return Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10));
}
function checkSessionTimeWindow(startTimeStr, endTimeStr, now = /* @__PURE__ */ new Date(), clientTzOffsetMinutes) {
  if (!startTimeStr) return { allowed: true };
  const startMs = getWallClockMs(startTimeStr);
  if (startMs === null) return { allowed: true };
  const endMs = endTimeStr ? getWallClockMs(endTimeStr) : null;
  const earliestMs = startMs - 15 * 60 * 1e3;
  const nowUtcMs = now.getTime();
  let offsetMs;
  if (typeof clientTzOffsetMinutes === "number" && !isNaN(clientTzOffsetMinutes)) {
    offsetMs = -clientTzOffsetMinutes * 60 * 1e3;
  } else {
    const localOffsetMins = now.getTimezoneOffset();
    offsetMs = localOffsetMins !== 0 ? -localOffsetMins * 60 * 1e3 : 8 * 3600 * 1e3;
  }
  const nowWallMs = nowUtcMs + offsetMs;
  const tooEarly = nowWallMs < earliestMs;
  const tooLate = endMs !== null && nowWallMs > endMs;
  if (!tooEarly && !tooLate) return { allowed: true };
  const timeFormatted = startTimeStr.includes("T") ? startTimeStr.split("T")[1].slice(0, 5) : startTimeStr.includes(" ") ? startTimeStr.split(" ")[1].slice(0, 5) : startTimeStr;
  if (tooEarly) return { allowed: false, reason: "too_early", timeFormatted: timeFormatted.replace(":", ".") };
  return { allowed: false, reason: "too_late", timeFormatted: timeFormatted.replace(":", ".") };
}
export {
  checkSessionTimeWindow as c,
  parseDate as p
};
