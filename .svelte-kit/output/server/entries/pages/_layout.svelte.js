import { s as store_get, a as attr_style, u as unsubscribe_stores, b as stringify, c as slot } from "../../chunks/index.js";
import { n as navigating } from "../../chunks/stores.js";
function PageLoader($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let progress = 0;
    let visible = false;
    let timer;
    if (store_get($$store_subs ??= {}, "$navigating", navigating)) {
      visible = true;
      progress = 10;
      clearInterval(timer);
      timer = setInterval(
        () => {
          progress += (95 - progress) * 0.1;
        },
        100
      );
    } else {
      progress = 100;
      clearInterval(timer);
      setTimeout(
        () => {
          visible = false;
          setTimeout(
            () => {
              progress = 0;
            },
            300
          );
        },
        300
      );
    }
    if (visible) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed top-0 left-0 w-full h-1 z-[100] transition-opacity duration-300"${attr_style(`opacity: ${visible ? "1" : "0"}`)}><div class="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 transition-all ease-out"${attr_style(`width: ${stringify(progress)}%; transition-duration: ${progress === 100 ? "300ms" : "100ms"};`)}></div> <div class="absolute top-0 right-0 h-full w-20 bg-white/40 blur-sm mix-blend-overlay animate-pulse transform translate-x-1/2"${attr_style(`left: ${stringify(progress)}%;`)}></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _layout($$renderer, $$props) {
  PageLoader($$renderer);
  $$renderer.push(`<!----> <!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]-->`);
}
export {
  _layout as default
};
