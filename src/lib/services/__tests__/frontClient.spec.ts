import { describe, it, expect } from 'vitest';
import { FrontClient } from '../frontClient';

/**
 * Tests for the `FrontClient` API helper.
 */
describe('FrontClient', () => {
    /**
     * Tests for the `fetchEvents` method.
     */
    describe('fetchEvents', () => {
        /**
         * Should return an array of events with expected values.
         */
        it('should return a list of events', async () => {
            const events = await FrontClient.fetchEvents();
            expect(Array.isArray(events)).toBe(true);
            expect(events.length).toBeGreaterThan(0);
            expect(events).toContain('Event A');
        });
    });

    /**
     * Tests for the `getAssetSignedUrl` method.
     */
    describe('getAssetSignedUrl', () => {
        /**
         * Should return an asset object with the correct key and default version.
         */
        it('should return an asset with the correct key', async () => {
            const key = 'logo';
            const asset = await FrontClient.getAssetSignedUrl(key);
            expect(asset.key).toBe(key);
            expect(asset.signedUrl).toBeDefined();
            expect(asset.version).toBe('1.0');
        });

        /**
         * Should correctly return assets for different keys.
         */
        it('should handle different keys', async () => {
            const key = 'banner';
            const asset = await FrontClient.getAssetSignedUrl(key);
            expect(asset.key).toBe(key);
        });
    });

    /**
     * Tests for the `getProfile` method.
     */
    describe('getProfile', () => {
        /**
         * Should return a user profile object with the correct id and default name/email values.
         */
        it('should return a user profile with correct id', async () => {
            const userId = '123';
            const profile = await FrontClient.getProfile(userId);
            expect(profile.id).toBe(userId);
            expect(profile.name).toBe('Demo User');
            expect(profile.email).toBeUndefined();
        });
    });
});
