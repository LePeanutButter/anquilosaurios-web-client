/**
 * Represents a digital asset.
 * @typedef {Object} Asset
 * @property {string} key - The unique identifier for the asset.
 * @property {string} [signedUrl] - A temporary signed URL to access the asset.
 * @property {string} [version] - The version of the asset.
 * @property {number} [sizeInMB] - The size of the asset in megabytes.
 * @property {string} [expiresAt] - ISO string indicating when the signed URL expires.
 */
export type Asset = {
	key: string;
	signedUrl?: string;
	version?: string;
	sizeInMB?: number;
	expiresAt?: string;
};

/**
 * Represents a user profile.
 * @typedef {Object} UserProfile
 * @property {string} id - The unique identifier of the user.
 * @property {string} name - The full name of the user.
 * @property {string} [email] - The email address of the user.
 */
export type UserProfile = {
	id: string;
	name: string;
	email?: string;
};

/**
 * Client for interacting with Front API.
 */
export const FrontClient = {
	/**
	 * Fetches a list of events.
	 * @returns {Promise<string[]>} A promise that resolves to an array of event names.
	 */
	async fetchEvents(): Promise<string[]> {
		return ['Event A', 'Event B', 'Event C'];
	},

	/**
	 * Retrieves a signed URL for an asset.
	 * @param {string} assetKey - The unique key of the asset.
	 * @returns {Promise<Asset>} A promise that resolves to the asset with its signed URL.
	 */
	async getAssetSignedUrl(assetKey: string): Promise<Asset> {
		return { key: assetKey, signedUrl: '', version: '1.0' };
	},

	/**
	 * Fetches the profile of a user by their ID.
	 * @param {string} userId - The unique ID of the user.
	 * @returns {Promise<UserProfile>} A promise that resolves to the user's profile.
	 */
	async getProfile(userId: string): Promise<UserProfile> {
		return { id: userId, name: 'Demo User' };
	}
};
