import consola from "consola";

/**
 * ResourceManager - Centralized management of Object URLs
 *
 * Tracks and manages all Object URLs created from Blobs to prevent memory leaks.
 * Uses a Map to ensure each Blob only has one URL created for it.
 */
export class ResourceManager {
  private blobUrlMap = new Map<Blob, string>();
  private urlBlobMap = new Map<string, Blob>();

  /**
   * Get or create an Object URL for a Blob
   * If a URL already exists for this Blob, returns the existing URL
   * Otherwise, creates a new URL and tracks it
   */
  getOrCreateURL(blob: Blob): string {
    // Check if we already have a URL for this blob
    if (this.blobUrlMap.has(blob)) {
      return this.blobUrlMap.get(blob)!;
    }

    // Create new URL and track it
    const url = URL.createObjectURL(blob);
    this.blobUrlMap.set(blob, url);
    this.urlBlobMap.set(url, blob);

    return url;
  }

  /**
   * Get URLs for multiple blobs
   * Returns an array of URLs in the same order as the input blobs
   */
  getOrCreateURLs(blobs: Blob[]): string[] {
    return blobs.map((blob) => this.getOrCreateURL(blob));
  }

  /**
   * Revoke a specific Object URL
   * Removes it from tracking and revokes it from memory
   */
  revokeURL(url: string): void {
    const blob = this.urlBlobMap.get(url);
    if (blob) {
      this.blobUrlMap.delete(blob);
      this.urlBlobMap.delete(url);
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Revoke URLs for specific blobs
   */
  revokeURLsForBlobs(blobs: Blob[]): void {
    for (const blob of blobs) {
      const url = this.blobUrlMap.get(blob);
      if (url) {
        this.revokeURL(url);
      }
    }
  }

  /**
   * Get the URL for a blob if it exists (without creating a new one)
   */
  getURL(blob: Blob): string | undefined {
    return this.blobUrlMap.get(blob);
  }

  /**
   * Check if a URL is being tracked
   */
  hasURL(url: string): boolean {
    return this.urlBlobMap.has(url);
  }

  /**
   * Get statistics about tracked URLs (useful for debugging)
   */
  getStats(): { trackedURLs: number; trackedBlobs: number } {
    return {
      trackedURLs: this.urlBlobMap.size,
      trackedBlobs: this.blobUrlMap.size,
    };
  }

  /**
   * Cleanup all tracked URLs
   * Should be called when the application unmounts or resets
   */
  cleanup(): void {
    const stats = this.getStats();
    if (stats.trackedURLs > 0) {
      consola.info(`Cleaning up ${stats.trackedURLs} tracked Object URLs`);
    }

    // Revoke all URLs
    for (const url of this.urlBlobMap.keys()) {
      URL.revokeObjectURL(url);
    }

    // Clear maps
    this.blobUrlMap.clear();
    this.urlBlobMap.clear();
  }
}
