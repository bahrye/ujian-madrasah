import { w as writable } from "./index2.js";
let nextId = 0;
function createToastStore() {
  const { subscribe, update } = writable([]);
  function add(message, type = "info", duration = 4e3) {
    const id = nextId++;
    update((toasts2) => [...toasts2, { id, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }
    return id;
  }
  function remove(id) {
    update((toasts2) => toasts2.filter((t) => t.id !== id));
  }
  return {
    subscribe,
    success: (msg, dur) => add(msg, "success", dur),
    error: (msg, dur) => add(msg, "error", dur ?? 6e3),
    warning: (msg, dur) => add(msg, "warning", dur),
    info: (msg, dur) => add(msg, "info", dur),
    remove
  };
}
const toasts = createToastStore();
export {
  toasts as t
};
