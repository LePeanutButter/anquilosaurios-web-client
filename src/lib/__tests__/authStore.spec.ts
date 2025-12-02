import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { authStore, isAuthenticated, currentUser, isAdmin } from '../authStore';

// Mock del entorno browser + localStorage
vi.mock('$app/environment', () => ({ browser: true }));

describe('authStore', () => {
	beforeEach(() => {
		localStorage.clear();
		authStore.logout();
	});

	it('should start with correct initial values', () => {
		const state = get(authStore);

		expect(state.user).toBeNull();
		expect(state.token).toBeNull();
		expect(state.isAuthenticated).toBe(false);
		expect(state.isLoading).toBe(false);
	});

	it('login should update user, token, and localStorage', () => {
		const user = {
			id: '1',
			name: 'Alice',
			username: 'alice',
			email: 'alice@test.com',
			isAdmin: true,
			authProvider: 'local'
		};

		authStore.login(user, 'abc123');

		const state = get(authStore);

		expect(state.user).toEqual(user);
		expect(state.token).toBe('abc123');
		expect(state.isAuthenticated).toBe(true);

		expect(localStorage.getItem('authToken')).toBe('abc123');
		expect(JSON.parse(localStorage.getItem('user')!)).toEqual(user);
	});

	it('logout should clear everything', () => {
		authStore.login(
			{
				id: '1',
				name: 'Test',
				username: 't',
				email: 't@test',
				isAdmin: false,
				authProvider: 'local'
			},
			'abc'
		);

		authStore.logout();

		const state = get(authStore);

		expect(state.user).toBeNull();
		expect(state.token).toBeNull();
		expect(state.isAuthenticated).toBe(false);

		expect(localStorage.getItem('authToken')).toBeNull();
		expect(localStorage.getItem('user')).toBeNull();
	});

	it('updateUser should modify only user field', () => {
		authStore.login(
			{ id: '1', name: 'A', username: 'a', email: 'a@test', isAdmin: false, authProvider: 'local' },
			'abc'
		);

		authStore.updateUser({
			id: '1',
			name: 'Updated',
			username: 'new',
			email: 'new@test.com',
			isAdmin: true,
			authProvider: 'local'
		});

		expect(get(authStore).user?.name).toBe('Updated');
	});

	it('setLoading toggles the loading state', () => {
		authStore.setLoading(true);
		expect(get(authStore).isLoading).toBe(true);

		authStore.setLoading(false);
		expect(get(authStore).isLoading).toBe(false);
	});

	it('derived store isAuthenticated should reflect auth state', () => {
		expect(get(isAuthenticated)).toBe(false);

		authStore.login(
			{ id: '1', name: 'A', username: 'a', email: 'a@test', isAdmin: false, authProvider: 'local' },
			'abc'
		);

		expect(get(isAuthenticated)).toBe(true);
	});

	it('currentUser derived store should return correct user', () => {
		expect(get(currentUser)).toBeNull();

		const user = {
			id: '1',
			name: 'Alice',
			username: 'alice',
			email: 'alice@test.com',
			isAdmin: false,
			authProvider: 'local'
		};

		authStore.login(user, 'abc');

		expect(get(currentUser)).toEqual(user);
	});

	it('isAdmin derived store should reflect user role', () => {
		expect(get(isAdmin)).toBe(false);

		authStore.login(
			{
				id: '1',
				name: 'Admin',
				username: 'admin',
				email: 'admin@test.com',
				isAdmin: true,
				authProvider: 'local'
			},
			'token'
		);

		expect(get(isAdmin)).toBe(true);
	});
});
