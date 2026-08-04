import { l as fallback, j as attr, i as attr_class, d as bind_props } from "./index.js";
function PasswordInput($$renderer, $$props) {
  let id = fallback($$props["id"], "password");
  let name = fallback($$props["name"], "password");
  let value = fallback($$props["value"], "");
  let placeholder = fallback($$props["placeholder"], "Masukkan kata sandi");
  let required = fallback($$props["required"], false);
  let autocomplete = fallback($$props["autocomplete"], "current-password");
  let iconLeft = fallback($$props["iconLeft"], false);
  let disabled = fallback($$props["disabled"], false);
  $$renderer.push(`<div class="relative w-full">`);
  if (iconLeft) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg></div>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--> <input${attr("id", id)}${attr("name", name)}${attr("type", "password")}${attr("required", required, true)}${attr("placeholder", placeholder)}${attr("autocomplete", autocomplete)}${attr("disabled", disabled, true)}${attr("value", value)}${attr_class(`input pr-10 ${iconLeft ? "pl-10" : ""}`)}/> <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:text-indigo-600 transition-colors p-1 rounded-md focus:outline-none"${attr("title", "Tampilkan kata sandi")}${attr("aria-label", "Tampilkan kata sandi")} tabindex="-1">`);
  {
    $$renderer.push("<!--[-1-->");
    $$renderer.push(`<svg class="w-5 h-5 text-slate-400 hover:text-slate-600 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12c1.074-4.65 5.244-8 10.214-8s9.14 3.35 10.214 8c-1.074 4.65-5.244 8-10.214 8s-9.14-3.35-10.214-8z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`);
  }
  $$renderer.push(`<!--]--></button></div>`);
  bind_props($$props, {
    id,
    name,
    value,
    placeholder,
    required,
    autocomplete,
    iconLeft,
    disabled
  });
}
export {
  PasswordInput as P
};
