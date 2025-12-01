import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

/**
 * Data Transfer Object for user registration.
 * @typedef {Object} UserRegisterDTO
 * @property {string} [id] - The unique identifier of the user.
 * @property {string} [name] - The name of the user.
 * @property {string} [email] - The email of the user.
 */
export type UserRegisterDTO = { id?: string; name?: string; email?: string };

/**
 * Information about a lobby.
 * @typedef {Object} LobbyInfo
 * @property {string} [lobbyId] - The unique ID of the lobby.
 * @property {string} [name] - The display name of the lobby.
 * @property {string} [status] - The current status of the lobby.
 */
export type LobbyInfo = { lobbyId?: string; name?: string; status?: string };

/**
 * Represents an asset bundle.
 * @typedef {Object} Bundle
 * @property {string} key - The unique key of the asset.
 * @property {string} url - The URL of the asset.
 * @property {string} [version] - The version of the asset.
 * @property {number} [size] - The size of the asset (optional, in MB or bytes).
 */
export type Bundle = { key: string; url: string; version?: string; size?: number };

/**
 * User accessibility preferences, stored as key-value pairs.
 * @typedef {Record<string, boolean | string | number | null>} AccessibilityPrefs
 */
export type AccessibilityPrefs = Record<string, boolean | string | number | null>;


/** Writable store for the currently logged-in user. */
export const currentUser: Writable<UserRegisterDTO | null> = writable(null);

/** Writable store for cached asset bundles. */
export const cachedAssets: Writable<Record<string, Bundle>> = writable({});

/** Writable store for the currently active lobby. */
export const activeLobby: Writable<LobbyInfo | null> = writable(null);

/** Writable store for the user's locale (language code). */
export const locale = writable('en');

/** Writable store for accessibility preferences. */
export const accessibilityPrefs = writable<AccessibilityPrefs>({});

/** Writable store indicating whether the user is authenticated. */
export const isAuthenticated = writable(false);

/**
 * UI store helper functions for managing application state.
 */
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
