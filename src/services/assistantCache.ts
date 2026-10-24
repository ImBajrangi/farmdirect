/**
 * Ultra-fast In-Memory & LocalStorage Cache System for Kisan AI Assistant.
 * Designed for zero-latency instant retrieval across low to high-performance devices.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class AssistantCacheService {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private maxMemoryItems: number = 50;
  private defaultTTLMs: number = 1000 * 60 * 60 * 24; // 24 hours

  constructor() {
    this.hydrateFromStorage();
  }

  private getKey(key: string): string {
    return `farmdirect_ai_cache_${key.toLowerCase().trim()}`;
  }

  private hydrateFromStorage(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('farmdirect_ai_cache_')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const entry: CacheEntry<any> = JSON.parse(raw);
            if (Date.now() < entry.expiresAt) {
              const cleanKey = key.replace('farmdirect_ai_cache_', '');
              this.memoryCache.set(cleanKey, entry);
            } else {
              localStorage.removeItem(key);
            }
          }
        }
      }
    } catch {
      // Graceful fallback for private/restricted browsing modes
    }
  }

  public get<T>(key: string): T | null {
    const cleanKey = key.toLowerCase().trim();
    const entry = this.memoryCache.get(cleanKey);

    if (entry) {
      if (Date.now() < entry.expiresAt) {
        return entry.data as T;
      }
      this.memoryCache.delete(cleanKey);
      try {
        localStorage.removeItem(this.getKey(cleanKey));
      } catch {}
    }
    return null;
  }

  public set<T>(key: string, data: T, ttlMs: number = this.defaultTTLMs): void {
    const cleanKey = key.toLowerCase().trim();
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttlMs,
    };

    // Evict oldest if memory cache exceeded
    if (this.memoryCache.size >= this.maxMemoryItems) {
      const firstKey = this.memoryCache.keys().next().value;
      if (firstKey) this.memoryCache.delete(firstKey);
    }

    this.memoryCache.set(cleanKey, entry);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.getKey(cleanKey), JSON.stringify(entry));
      }
    } catch {
      // Storage full or restricted; in-memory fallback handles it smoothly
    }
  }

  public clear(): void {
    this.memoryCache.clear();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('farmdirect_ai_cache_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      }
    } catch {}
  }
}

export const assistantCache = new AssistantCacheService();
