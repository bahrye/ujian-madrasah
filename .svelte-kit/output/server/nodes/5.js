import * as server from '../entries/pages/siswa/_layout.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/siswa/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/siswa/+layout.server.ts";
export const imports = ["_app/immutable/nodes/5.CZdsdwMC.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BAlCm58o.js","_app/immutable/chunks/DDxqhf5o.js","_app/immutable/chunks/BPo3cuOX.js","_app/immutable/chunks/Dc4AZ3On.js","_app/immutable/chunks/D40_HmD-.js","_app/immutable/chunks/CL4nhdES.js","_app/immutable/chunks/BJofkP_5.js","_app/immutable/chunks/Col4vhdl.js","_app/immutable/chunks/Cu5DELs4.js","_app/immutable/chunks/DKn05TpQ.js","_app/immutable/chunks/2avL9sAB.js","_app/immutable/chunks/CS303wAA.js","_app/immutable/chunks/DiEor4nZ.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/B-KkmaGk.js","_app/immutable/chunks/CxkGZLy8.js","_app/immutable/chunks/BnTbq41U.js","_app/immutable/chunks/zX8JxDza.js","_app/immutable/chunks/CcJDwDvi.js"];
export const stylesheets = [];
export const fonts = [];
