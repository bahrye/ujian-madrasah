import { type Handle } from '@sveltejs/kit';
import { verifyToken, COOKIE_NAME } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(COOKIE_NAME);

	if (token) {
		const user = await verifyToken(token);
		event.locals.user = user;
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
