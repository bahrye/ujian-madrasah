import { g as getContext, af as fallback, ag as store_get, c as ensure_array_like, i as attr, d as attr_class, e as escape_html, a as stringify, ah as unsubscribe_stores, b as bind_props, s as slot } from "./index.js";
import "clsx";
import "@sveltejs/kit/internal";
import "./exports.js";
import "./utils2.js";
import "@sveltejs/kit/internal/server";
import "./root.js";
import "./state.svelte.js";
import { I as ICONS, b as ROLE_LABELS } from "./constants.js";
import { T as Toast } from "./Toast2.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function Sidebar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let currentPath;
    let menuItems = fallback($$props["menuItems"], () => [], true);
    let user = $$props["user"];
    let isOpen = fallback($$props["isOpen"], false);
    function isActive(href) {
      if (href === `/${user?.role}`) {
        return currentPath === href;
      }
      return currentPath.startsWith(href);
    }
    const roleGradients = {
      admin: "from-rose-500 to-pink-500",
      guru: "from-indigo-500 to-violet-500",
      pengawas: "from-amber-500 to-orange-500",
      siswa: "from-cyan-500 to-sky-500"
    };
    currentPath = store_get($$store_subs ??= {}, "$page", page).url.pathname;
    $$renderer2.push(`<aside class="hidden lg:flex flex-col w-64 min-h-screen bg-gradient-to-b from-primary-950 to-primary-900 text-white border-r border-primary-800/50 fixed left-0 top-0 z-40"><div class="p-6 border-b border-primary-800/50"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center shadow-lg shadow-indigo-500/30"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div> <div><h1 class="text-base font-bold tracking-tight">Ujian Madrasah</h1> <p class="text-xs text-primary-300">Sistem Ujian Online</p></div></div></div> <nav class="flex-1 p-4 space-y-1 overflow-y-auto"><!--[-->`);
    const each_array = ensure_array_like(menuItems);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$renderer2.push(`<a${attr("href", item.href)}${attr_class(`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(item.href) ? "bg-white/15 text-white shadow-lg shadow-white/5" : "text-primary-300 hover:text-white hover:bg-white/10"}`)}><svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS[item.icon] || "")}></path></svg> <span>${escape_html(item.label)}</span> `);
      if (isActive(item.href)) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-lg shadow-white/50"></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></a>`);
    }
    $$renderer2.push(`<!--]--></nav> <div class="p-4 border-t border-primary-800/50"><div class="flex items-center gap-3 px-3 py-2"><div${attr_class(`w-9 h-9 rounded-full bg-gradient-to-br ${stringify(roleGradients[user?.role ?? "siswa"])} flex items-center justify-center text-sm font-bold shadow-lg`)}>${escape_html(user?.name?.charAt(0).toUpperCase() ?? "?")}</div> <div class="flex-1 min-w-0"><p class="text-sm font-semibold truncate">${escape_html(user?.name ?? "Pengguna")}</p> <p class="text-xs text-primary-400">${escape_html(ROLE_LABELS[user?.role ?? ""] ?? "")}</p></div> <a href="/api/logout" class="p-1.5 rounded-lg text-primary-400 hover:text-white hover:bg-white/10 transition-colors" title="Keluar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.logout)}></path></svg></a></div></div></aside> `);
    if (isOpen) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"><aside class="w-72 h-full bg-gradient-to-b from-primary-950 to-primary-900 text-white shadow-2xl flex flex-col"><div class="p-5 border-b border-primary-800/50 flex items-center justify-between"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center shadow-lg shadow-indigo-500/30"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div> <span class="text-base font-bold">Ujian Madrasah</span></div> <button class="p-1.5 rounded-lg hover:bg-white/10 transition-colors" aria-label="Tutup menu"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.close)}></path></svg></button></div> <nav class="flex-1 p-4 space-y-1 overflow-y-auto"><!--[-->`);
      const each_array_1 = ensure_array_like(menuItems);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let item = each_array_1[$$index_1];
        $$renderer2.push(`<a${attr("href", item.href)}${attr_class(`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(item.href) ? "bg-white/15 text-white" : "text-primary-300 hover:text-white hover:bg-white/10"}`)}><svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS[item.icon] || "")}></path></svg> <span>${escape_html(item.label)}</span></a>`);
      }
      $$renderer2.push(`<!--]--></nav> <div class="p-4 border-t border-primary-800/50"><div class="flex items-center gap-3 px-3 py-2"><div${attr_class(`w-9 h-9 rounded-full bg-gradient-to-br ${stringify(roleGradients[user?.role ?? "siswa"])} flex items-center justify-center text-sm font-bold`)}>${escape_html(user?.name?.charAt(0).toUpperCase() ?? "?")}</div> <div class="flex-1 min-w-0"><p class="text-sm font-semibold truncate">${escape_html(user?.name ?? "Pengguna")}</p> <p class="text-xs text-primary-400">${escape_html(ROLE_LABELS[user?.role ?? ""] ?? "")}</p></div></div> <a href="/api/logout" class="mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-primary-300 hover:text-white hover:bg-white/10 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.logout)}></path></svg> Keluar</a></div></aside></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { menuItems, user, isOpen });
  });
}
function Navbar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let user = $$props["user"];
    const roleGradients = {
      admin: "from-rose-500 to-pink-500",
      guru: "from-indigo-500 to-violet-500",
      pengawas: "from-amber-500 to-orange-500",
      siswa: "from-cyan-500 to-sky-500"
    };
    $$renderer2.push(`<header class="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4 py-3"><div class="flex items-center justify-between"><div class="flex items-center gap-3"><button class="p-2 -ml-1 rounded-xl hover:bg-slate-100 transition-colors" aria-label="Buka menu"><svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.menu)}></path></svg></button> <div class="flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20"><svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div> <span class="font-bold text-sm text-slate-800">Ujian Madrasah</span></div></div> <div class="flex items-center gap-2"><span class="text-xs font-medium text-slate-500 hidden sm:block">${escape_html(ROLE_LABELS[user?.role ?? ""] ?? "")}</span> <div${attr_class(`w-8 h-8 rounded-full bg-gradient-to-br ${stringify(roleGradients[user?.role ?? "siswa"])} flex items-center justify-center text-xs font-bold text-white shadow-md`)}>${escape_html(user?.name?.charAt(0).toUpperCase() ?? "?")}</div></div></div></header>`);
    bind_props($$props, { user });
  });
}
function AppShell($$renderer, $$props) {
  let user = $$props["user"];
  let menuItems = fallback($$props["menuItems"], () => [], true);
  let sidebarOpen = false;
  let $$settled = true;
  let $$inner_renderer;
  function $$render_inner($$renderer2) {
    $$renderer2.push(`<div class="min-h-screen bg-slate-50">`);
    Sidebar($$renderer2, {
      menuItems,
      user,
      get isOpen() {
        return sidebarOpen;
      },
      set isOpen($$value) {
        sidebarOpen = $$value;
        $$settled = false;
      }
    });
    $$renderer2.push(`<!----> `);
    Navbar($$renderer2, { user });
    $$renderer2.push(`<!----> <main class="lg:ml-64 min-h-screen"><div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></div></main> `);
    Toast($$renderer2);
    $$renderer2.push(`<!----></div>`);
  }
  do {
    $$settled = true;
    $$inner_renderer = $$renderer.copy();
    $$render_inner($$inner_renderer);
  } while (!$$settled);
  $$renderer.subsume($$inner_renderer);
  bind_props($$props, { user, menuItems });
}
export {
  AppShell as A
};
