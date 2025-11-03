import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export type UserRegisterDTO = { id?: string; name?: string; email?: string };
export type LobbyInfo = { lobbyId?: string; name?: string; status?: string };
export type Bundle = { key: string; url: string; version?: string; size?: number };

export type AccessibilityPrefs = Record<string, boolean | string | number | null>;

export const currentUser: Writable<UserRegisterDTO | null> = writable(null);
export const cachedAssets: Writable<Record<string, Bundle>> = writable({});
export const activeLobby: Writable<LobbyInfo | null> = writable(null);
export const locale = writable('en');
export const accessibilityPrefs = writable<AccessibilityPrefs>({});
export const isAuthenticated = writable(false);

// UI store helpers
export const uiStore = {
	setCurrentUser: (u: UserRegisterDTO) => currentUser.set(u),
	clearUser: () => currentUser.set(null),
	cacheAsset: (key: string, bundle: Bundle) => {
		cachedAssets.update((m) => ({ ...m, [key]: bundle }));
	},
	setLocale: (l: string) => locale.set(l),
	setAccessibility: (k: keyof AccessibilityPrefs, v: AccessibilityPrefs[typeof k]) =>
		accessibilityPrefs.update((s) => ({ ...s, [k]: v }))
};
