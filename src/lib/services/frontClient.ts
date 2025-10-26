// Interfaz / stub para uso en UI.

export type Asset = { key: string; signedUrl?: string; version?: string; sizeInMB?: number; expiresAt?: string };

export const FrontClient = {
  // UI will just call these; implementations should be provided by you/backend
  async fetchEvents(): Promise<string[]> {
    // stub: replace with real API call
    return Promise.resolve(["Event A", "Event B", "Event C"]);
  },
  async getAssetSignedUrl(assetKey: string): Promise<Asset> {
    return Promise.resolve({ key: assetKey, signedUrl: "", version: "1.0" });
  },
  async getProfile(userId: string): Promise<any> {
    return Promise.resolve({ id: userId, name: "Demo User" });
  }
};
