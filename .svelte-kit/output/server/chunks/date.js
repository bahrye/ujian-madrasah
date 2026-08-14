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
function getWallClockMinutes(dateStr) {
  if (!dateStr) return null;
  const str = String(dateStr);
  const match = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[T\s](\d{1,2}):(\d{1,2})/);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match;
  return Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10)) / 6e4;
}
function getNowWallClockMinutes(now = /* @__PURE__ */ new Date(), timeZone) {
  try {
    const tz = timeZone || (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "Asia/Makassar");
    const str = now.toLocaleString("sv-SE", { timeZone: tz });
    const minutes = getWallClockMinutes(str);
    if (minutes !== null) return minutes;
  } catch (e) {
  }
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()) / 6e4;
}
function checkSessionTimeWindow(startTimeStr, endTimeStr, now = /* @__PURE__ */ new Date()) {
  if (!startTimeStr) return { allowed: true };
  const startMinutes = getWallClockMinutes(startTimeStr);
  if (startMinutes === null) return { allowed: true };
  const endMinutes = endTimeStr ? getWallClockMinutes(endTimeStr) : null;
  const earliestMinutes = startMinutes - 15;
  const timezones = ["Asia/Makassar", "Asia/Jakarta", "Asia/Jayapura"];
  try {
    const systemTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (systemTz && !timezones.includes(systemTz)) timezones.unshift(systemTz);
  } catch (e) {
  }
  let isTooEarly = false;
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
  }
  if (isAllowed) return { allowed: true };
  const timeFormatted = startTimeStr.includes("T") ? startTimeStr.split("T")[1].slice(0, 5) : startTimeStr.includes(" ") ? startTimeStr.split(" ")[1].slice(0, 5) : startTimeStr;
  if (isTooEarly) return { allowed: false, reason: "too_early", timeFormatted: timeFormatted.replace(":", ".") };
  return { allowed: false, reason: "too_late", timeFormatted: timeFormatted.replace(":", ".") };
}
export {
  checkSessionTimeWindow as c,
  parseDate as p
};
