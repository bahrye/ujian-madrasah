import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
	id: number;
	message: string;
	type: ToastType;
	duration: number;
}

let nextId = 0;

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	function add(message: string, type: ToastType = 'info', duration: number = 4000) {
		const id = nextId++;
		update((toasts) => [...toasts, { id, message, type, duration }]);

		if (duration > 0) {
			setTimeout(() => {
				remove(id);
			}, duration);
		}

		return id;
	}

	function remove(id: number) {
		update((toasts) => toasts.filter((t) => t.id !== id));
	}

	return {
		subscribe,
		success: (msg: string, dur?: number) => add(msg, 'success', dur),
		error: (msg: string, dur?: number) => add(msg, 'error', dur ?? 6000),
		warning: (msg: string, dur?: number) => add(msg, 'warning', dur),
		info: (msg: string, dur?: number) => add(msg, 'info', dur),
		remove
	};
}

export const toasts = createToastStore();
