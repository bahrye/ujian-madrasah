function parseDate(dateStr) {
  if (!dateStr) return /* @__PURE__ */ new Date();
  let str = String(dateStr);
  if (str.includes(" ") && !str.includes("Z") && !str.includes("T")) {
    str = str.replace(" ", "T") + "Z";
  } else if (str.includes("T") && !str.includes("Z") && !str.includes("+") && !str.includes("-")) {
    str = str + "Z";
  }
  return new Date(str);
}
export {
  parseDate as p
};
