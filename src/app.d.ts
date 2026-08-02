/// <reference types="@sveltejs/kit" />
/// <reference types="@cloudflare/workers-types" />

declare global {
	namespace App {
		interface Platform {
			env: {
				DB: D1Database;
				EXAM_ANSWERS: KVNamespace;
			};
			context: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}

		interface Locals {
			user: {
				id: number;
				school_id: number | null;
				username: string;
				name: string;
				role: 'superadmin' | 'admin' | 'guru' | 'pengawas' | 'siswa';
			} | null;
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
