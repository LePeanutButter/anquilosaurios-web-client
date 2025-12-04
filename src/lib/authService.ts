import { authStore } from './authStore';
import type { User } from './authStore';

const API_BASE_URL = 'http://dotnet_backend:5000/api'; // NOSONAR

interface ApiResponse<T> {
	data: T;
	message: string;
}

interface LoginResponse {
	user: User;
	token: string;
}

interface RegisterData {
	name: string;
	username: string;
	email: string;
	rawPassword: string;
}

interface LoginData {
	identifier: string;
	rawPassword: string;
}

class AuthService {
	private readonly baseUrl: string;

	constructor(baseUrl: string = API_BASE_URL) {
		this.baseUrl = baseUrl;
	}

	private getToken(): string | null {
		let token: string | null = null;
		authStore.subscribe((state) => {
			token = state.token;
		})();
		return token;
	}

	private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
		const url = `${this.baseUrl}${endpoint}`;

		const headers: Record<string, string> = {
			'Content-Type': 'application/json'
		};

		if (options.headers) {
			const optionsHeaders = options.headers as Record<string, string>;
			Object.assign(headers, optionsHeaders);
		}

		const token = this.getToken();
		if (token && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		try {
			const response = await fetch(url, {
				...options,
				headers
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(errorData?.message || `Error: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error('API Error:', error);
			throw error;
		}
	}

	async register(data: RegisterData): Promise<LoginResponse> {
		authStore.setLoading(true);

		try {
			const response = await this.request<LoginResponse>('/auth/register', {
				method: 'POST',
				body: JSON.stringify(data)
			});

			authStore.login(response.data.user, response.data.token);

			return response.data;
		} catch (error) {
			authStore.setLoading(false);
			throw error;
		}
	}

	async login(data: LoginData): Promise<LoginResponse> {
		authStore.setLoading(true);

		try {
			const response = await this.request<LoginResponse>('/auth/login', {
				method: 'POST',
				body: JSON.stringify(data)
			});

			authStore.login(response.data.user, response.data.token);

			return response.data;
		} catch (error) {
			authStore.setLoading(false);
			throw error;
		}
	}

	async logout(): Promise<void> {
		try {
			await this.request('/auth/logout', {
				method: 'POST'
			});
		} catch (error) {
			console.error('Error al hacer logout:', error);
		} finally {
			authStore.logout();
		}
	}

	async getCurrentUser(): Promise<User> {
		const response = await this.request<User>('/auth/me', {
			method: 'GET'
		});

		authStore.updateUser(response.data);

		return response.data;
	}

	async checkAuth(): Promise<boolean> {
		try {
			await this.getCurrentUser();
			return true;
		} catch (error) {
			console.error('checkAuth failed:', error);
			authStore.logout();
			return false;
		}
	}
}

export const authService = new AuthService();

export type { RegisterData, LoginData, LoginResponse };
