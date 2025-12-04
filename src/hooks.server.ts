import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname === '/') {
		throw redirect(302, '/app');
	}

	const response = await resolve(event);

	if (response.status === 404) {
		throw redirect(302, '/app');
	}

	return response;
};
