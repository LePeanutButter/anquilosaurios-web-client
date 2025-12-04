import { it, expect, describe } from 'vitest';
import { GET } from '../+server';

describe('API Health Endpoint', () => {
	it('should return a 200 status and a JSON message', async () => {
		const response = await GET();

		expect(response.status).toBe(200);

		expect(response.headers.get('content-type')).toBe('application/json');

		const data = await response.json();
		expect(data).toEqual({ message: 'Healthy' });
	});
});
