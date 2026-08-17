import { f as bind_props, d as slot } from "../../../chunks/index.js";
import { A as AppShell } from "../../../chunks/AppShell.js";
import { S as SIDEBAR_MENUS } from "../../../chunks/constants.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let menuItems;
    let data = $$props["data"];
    menuItems = (() => {
      if (data.user?.role === "admin" || data.user?.role === "superadmin" || data.user?.role === "panitia") {
        return SIDEBAR_MENUS.admin;
      }
      if (data.user?.role === "guru") {
        return [
          ...SIDEBAR_MENUS.guru,
          {
            label: "Pengawasan Ujian",
            icon: "monitor",
            subItems: [
              { label: "Dashboard Pengawas", href: "/pengawas" },
              { label: "Tata Tertib", href: "/pengawas/tata-tertib" },
              { label: "Jadwal Saya", href: "/pengawas/jadwal/saya" },
              { label: "Jadwal Semua", href: "/pengawas/jadwal/semua" },
              { label: "Generate Token", href: "/pengawas/tokens" },
              { label: "Monitoring Siswa", href: "/pengawas/monitor" },
              { label: "Reset Login Siswa", href: "/pengawas/reset-login" }
            ]
          }
        ];
      }
      return SIDEBAR_MENUS.pengawas;
    })();
    AppShell($$renderer2, {
      user: data.user,
      userInfo: data.userInfo,
      menuItems,
      children: ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        slot($$renderer3, $$props, "default", {});
        $$renderer3.push(`<!--]-->`);
      },
      $$slots: { default: true }
    });
    bind_props($$props, { data });
  });
}
export {
  _layout as default
};
