import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { uiStore, currentUser, cachedAssets, activeLobby, locale, accessibilityPrefs, isAuthenticated } from '../uiStore';

/**
 * Tests for the `uiStore` helper functions and Svelte writable stores.
 */
describe('uiStore', () => {

    /**
     * Resets all stores to their default initial values before each test.
     */
    beforeEach(() => {
        currentUser.set(null);
        cachedAssets.set({});
        activeLobby.set(null);
        locale.set('en');
        accessibilityPrefs.set({});
        isAuthenticated.set(false);
    });

    /**
     * Ensures all stores have correct initial values.
     */
    it('should have correct initial values', () => {
        expect(get(currentUser)).toBeNull();
        expect(get(cachedAssets)).toEqual({});
        expect(get(activeLobby)).toBeNull();
        expect(get(locale)).toBe('en');
        expect(get(accessibilityPrefs)).toEqual({});
        expect(get(isAuthenticated)).toBe(false);
    });

    /**
     * Ensures `setCurrentUser` correctly updates `currentUser` store.
     */
    it('setCurrentUser should update currentUser', () => {
        const user = { id: '1', name: 'Alice', email: 'alice@test.com' };
        uiStore.setCurrentUser(user);
        expect(get(currentUser)).toEqual(user);
    });

    /**
     * Ensures `clearUser` resets `currentUser` to null.
     */
    it('clearUser should reset currentUser to null', () => {
        uiStore.setCurrentUser({ id: '1', name: 'Alice' });
        uiStore.clearUser();
        expect(get(currentUser)).toBeNull();
    });

    /**
     * Ensures `cacheAsset` adds a bundle to the `cachedAssets` store.
     */
    it('cacheAsset should add a bundle', () => {
        const bundle = { key: 'logo', url: '/logo.svg', version: '1.0' };
        uiStore.cacheAsset('logo', bundle);
        expect(get(cachedAssets)).toEqual({ logo: bundle });
    });

    /**
     * Ensures `setLocale` updates the `locale` store.
     */
    it('setLocale should update the locale', () => {
        uiStore.setLocale('es');
        expect(get(locale)).toBe('es');
    });

    /**
     * Ensures `setAccessibility` updates individual accessibility preferences.
     */
    it('setAccessibility should update a preference', () => {
        uiStore.setAccessibility('highContrast', true);
        expect(get(accessibilityPrefs)).toEqual({ highContrast: true });

        uiStore.setAccessibility('highContrast', false);
        expect(get(accessibilityPrefs)).toEqual({ highContrast: false });
    });
});
