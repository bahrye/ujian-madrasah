

export const index = 57;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/tata-tertib/_page.svelte.js')).default;
export const imports = ["entries/pages/siswa/tata-tertib/_page.svelte.js","chunks/index.js"];
export const stylesheets = [];
export const fonts = [];
