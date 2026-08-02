import { l as fallback, i as attr, s as slot, d as attr_class, j as clsx, b as bind_props } from "./index.js";
import "@sveltejs/kit/internal";
import "./exports.js";
import "./utils2.js";
import "@sveltejs/kit/internal/server";
import "./root.js";
import "./state.svelte.js";
function ConfirmForm($$renderer, $$props) {
  let action = $$props["action"];
  let confirmMessage = $$props["confirmMessage"];
  let confirmTitle = fallback($$props["confirmTitle"], "Konfirmasi");
  let buttonClass = fallback($$props["buttonClass"], "");
  let buttonTitle = fallback($$props["buttonTitle"], "");
  $$renderer.push(`<form method="POST"${attr("action", action)} class="inline-block"><!--[-->`);
  slot($$renderer, $$props, "inputs", {});
  $$renderer.push(`<!--]--> <button type="submit"${attr_class(clsx(buttonClass))}${attr("title", buttonTitle)}><!--[-->`);
  slot($$renderer, $$props, "buttonContent", {});
  $$renderer.push(`<!--]--></button></form> `);
  {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]-->`);
  bind_props($$props, {
    action,
    confirmMessage,
    confirmTitle,
    buttonClass,
    buttonTitle
  });
}
export {
  ConfirmForm as C
};
