import { f as bind_props, d as slot } from "../../../chunks/index.js";
import { A as AppShell } from "../../../chunks/AppShell.js";
import { S as SIDEBAR_MENUS } from "../../../chunks/constants.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    AppShell($$renderer2, {
      user: data.user,
      userInfo: data.userInfo,
      menuItems: SIDEBAR_MENUS.siswa,
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
