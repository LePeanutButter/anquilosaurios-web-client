import { json } from '@sveltejs/kit';

export async function GET() {
	const data = { message: 'Healthy' };
	return json(data);
}
