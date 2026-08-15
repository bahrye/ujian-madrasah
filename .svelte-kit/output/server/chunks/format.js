function parseProctors(proctorsInput) {
  if (!proctorsInput) return [{ label: "Pengawas Ruang", name: "-" }];
  let names = [];
  if (Array.isArray(proctorsInput)) {
    names = proctorsInput.map((s) => s.trim()).filter(Boolean);
  } else {
    names = proctorsInput.split(/\|\||,/).map((s) => s.trim()).filter(Boolean);
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
function formatProctorsText(proctorsInput) {
  const list = parseProctors(proctorsInput);
  return list.map((p) => `${p.label}: ${p.name}`).join(" | ");
}
export {
  formatProctorsText as f,
  parseProctors as p
};
