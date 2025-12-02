import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../authService';
import { authStore } from '../authStore';

// Mock global fetch
global.fetch = vi.fn();
const mockFetch = vi.mocked(fetch);

// Espías de authStore
vi.spyOn(authStore, 'login');
vi.spyOn(authStore, 'logout');
vi.spyOn(authStore, 'setLoading');
vi.spyOn(authStore, 'updateUser');

describe('authService', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('register should call API and login user', async () => {
		const mockResponse = {
			data: {
				user: {
					id: '1',
					name: 'Alice',
					username: 'alice',
					email: 'alice@test.com',
					isAdmin: false,
					authProvider: 'local'
				},
				token: 'abc123'
			},
			message: 'ok'
		};

		mockFetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(mockResponse)
		} as Response);

		const output = await authService.register({
			name: 'Alice',
			username: 'alice',
			email: 'alice@test.com',
			rawPassword: '123'
		});

		expect(authStore.login).toHaveBeenCalledWith(
			mockResponse.data.user,
			mockResponse.data.token
		);

		expect(output).toEqual(mockResponse.data);
	});

	it('login should authenticate user and store token', async () => {
		const mockResponse = {
			data: {
				user: {
					id: '1',
					name: 'Alice',
					username: 'alice',
					email: 'alice@test.com',
					isAdmin: false,
					authProvider: 'local'
				},
				token: 'xyz'
			},
			message: 'ok'
		};

		mockFetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(mockResponse)
		} as Response);

		const result = await authService.login({
			identifier: 'alice@test.com',
			rawPassword: '123'
		});

		expect(authStore.login).toHaveBeenCalled();
		expect(result).toEqual(mockResponse.data);
	});

	it('logout should call API and clear authStore', async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({})
		} as Response);

		await authService.logout();

		expect(authStore.logout).toHaveBeenCalled();
	});

	it('getCurrentUser should fetch user and update authStore', async () => {
		const mockUser = {
			id: '1',
			name: 'Test',
			username: 'test',
			email: 'test@test.com',
			isAdmin: false,
			authProvider: 'local'
		};

		mockFetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ data: mockUser })
		} as Response);

		const output = await authService.getCurrentUser();

		expect(authStore.updateUser).toHaveBeenCalledWith(mockUser);
		expect(output).toEqual(mockUser);
	});

	it('checkAuth should return true when token and user are valid', async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ data: { id: '1' } })
		} as Response);

		const result = await authService.checkAuth();

		expect(result).toBe(true);
	});

	it('checkAuth should return false and logout on error', async () => {
		mockFetch.mockRejectedValue(new Error('fail'));

		const result = await authService.checkAuth();

		expect(authStore.logout).toHaveBeenCalled();
		expect(result).toBe(false);
	});
});
