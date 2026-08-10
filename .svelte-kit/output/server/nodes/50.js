

export const index = 50;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pengawas/tata-tertib/_page.svelte.js')).default;
export const imports = ["entries/pages/pengawas/tata-tertib/_page.svelte.js","chunks/index.js"];
export const stylesheets = [];
export const fonts = [];
