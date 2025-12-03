import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../authService';
import { authStore } from '../authStore';

globalThis.fetch = vi.fn();
const mockFetch = vi.mocked(fetch);

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

		expect(authStore.login).toHaveBeenCalledWith(mockResponse.data.user, mockResponse.data.token);

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

	it('request should include Authorization header if token exists', async () => {
		vi.spyOn(authStore, 'subscribe').mockImplementation((fn) => {
			fn({
				user: null,
				token: 'test-token',
				isAuthenticated: true,
				isLoading: false
			});
			return () => {};
		});

		mockFetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ data: 'ok' })
		} as Response);

		await authService['request']('/api/test', { method: 'GET' });

		expect(mockFetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				headers: expect.objectContaining({
					Authorization: 'Bearer test-token'
				})
			})
		);
	});

	it('request should throw error on non-ok response', async () => {
		mockFetch.mockResolvedValue({
			ok: false,
			status: 400,
			json: () => Promise.resolve({ message: 'Bad Request' })
		} as Response);

		await expect(authService['request']('/api/test')).rejects.toThrow('Bad Request');
	});

	it('logout should handle API errors gracefully', async () => {
		mockFetch.mockRejectedValue(new Error('Network fail'));

		await authService.logout();

		expect(authStore.logout).toHaveBeenCalled();
	});

	it('register should disable loading on failure', async () => {
		mockFetch.mockRejectedValue(new Error('fail'));

		await expect(
			authService.register({
				name: 'Fail',
				username: 'fail',
				email: 'fail@test.com',
				rawPassword: '123'
			})
		).rejects.toThrow('fail');

		expect(authStore.setLoading).toHaveBeenCalledWith(false);
	});

	it('login should disable loading on failure', async () => {
		mockFetch.mockRejectedValue(new Error('fail'));

		await expect(
			authService.login({
				identifier: 'fail@test.com',
				rawPassword: '123'
			})
		).rejects.toThrow('fail');

		expect(authStore.setLoading).toHaveBeenCalledWith(false);
	});
});
