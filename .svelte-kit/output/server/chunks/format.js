function parseProctors(proctorsInput) {
  if (!proctorsInput) return [{ label: "Pengawas Ruang", name: "-" }];
  let names = [];
  if (Array.isArray(proctorsInput)) {
    names = proctorsInput.map((s) => s.trim()).filter(Boolean);
  } else if (typeof proctorsInput === "string") {
    const str = proctorsInput.trim();
    if (!str) return [{ label: "Pengawas Ruang", name: "-" }];
    if (str.includes("||")) {
      names = str.split("||").map((s) => s.trim()).filter(Boolean);
    } else {
      names = [str];
    }
  }
  if (names.length === 0) {
    return [{ label: "Pengawas Ruang", name: "-" }];
  }
  if (names.length === 1) {
    return [{ label: "Pengawas Ruang", name: names[0] }];
  }
  return names.map((name, idx) => ({
    label: `Pengawas ${idx + 1}`,
    name
  }));
}
export {
  parseProctors as p
};
