import { Movie, SearchResult } from '../types/movie';

interface StorageConfig {
  prefix: string;
  ttl: number;
  storage?: Storage;
  fallbackToMemory?: boolean;
}

interface StorageItem<T> {
  data: T;
  timestamp: number;
  version: number;
}

class MemoryStorage {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

export class StorageService {
  private config: StorageConfig;
  private memoryFallback: MemoryStorage;
  private currentStorage: Storage | MemoryStorage;
  private readonly DATA_VERSION = 1;

  constructor(config?: Partial<StorageConfig>) {
    this.config = {
      prefix: 'x-stream-',
      ttl: 24 * 60 * 60 * 1000, // 24 hours by default
      fallbackToMemory: true,
      ...config
    };

    this.memoryFallback = new MemoryStorage();
    this.currentStorage = this.initializeStorage();
  }

  private initializeStorage(): Storage | MemoryStorage {
    // Try using specified storage or localStorage by default
    const preferredStorage = this.config.storage || localStorage;

    try {
      // Test if storage is available
      const testKey = `${this.config.prefix}test`;
      preferredStorage.setItem(testKey, 'test');
      preferredStorage.removeItem(testKey);
      return preferredStorage;
    } catch (error) {
      console.warn('Storage not available, falling back to memory storage');
      return this.config.fallbackToMemory ? this.memoryFallback : preferredStorage;
    }
  }

  private getKey(key: string): string {
    return `${this.config.prefix}${key}`;
  }

  private isValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.config.ttl;
  }

  private wrapData<T>(data: T): StorageItem<T> {
    return {
      data,
      timestamp: Date.now(),
      version: this.DATA_VERSION
    };
  }

  set<T>(key: string, data: T): boolean {
    try {
      const item = this.wrapData(data);
      const serialized = JSON.stringify(item);
      
      try {
        this.currentStorage.setItem(this.getKey(key), serialized);
        return true;
      } catch (error) {
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          this.clearExpired();
          try {
            this.currentStorage.setItem(this.getKey(key), serialized);
            return true;
          } catch {
            if (this.config.fallbackToMemory) {
              this.memoryFallback.setItem(this.getKey(key), serialized);
              return true;
            }
          }
        }
        throw error;
      }
    } catch (error) {
      console.error('Error saving to storage:', error);
      return false;
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = this.currentStorage.getItem(this.getKey(key));
      if (!item) return null;

      const { data, timestamp, version }: StorageItem<T> = JSON.parse(item);
      
      // Handle version mismatch
      if (version !== this.DATA_VERSION) {
        this.remove(key);
        return null;
      }

      // Check if data has expired
      if (!this.isValid(timestamp)) {
        this.remove(key);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      this.currentStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  }

  clearExpired(): void {
    try {
      const keys = Object.keys(this.currentStorage);
      for (const key of keys) {
        if (key.startsWith(this.config.prefix)) {
          try {
            const item = this.currentStorage.getItem(key);
            if (item) {
              const { timestamp }: StorageItem<unknown> = JSON.parse(item);
              if (!this.isValid(timestamp)) {
                this.currentStorage.removeItem(key);
              }
            }
          } catch {
            // If we can't parse the item, remove it
            this.currentStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Error clearing expired items:', error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(this.currentStorage);
      for (const key of keys) {
        if (key.startsWith(this.config.prefix)) {
          this.currentStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  getStats(): { used: number; total: number; items: number } {
    let used = 0;
    let items = 0;

    try {
      const keys = Object.keys(this.currentStorage);
      for (const key of keys) {
        if (key.startsWith(this.config.prefix)) {
          const item = this.currentStorage.getItem(key);
          if (item) {
            used += item.length * 2; // UTF-16 characters = 2 bytes
            items++;
          }
        }
      }
    } catch (error) {
      console.error('Error calculating storage stats:', error);
    }

    return {
      used,
      total: 5 * 1024 * 1024, // 5MB typical localStorage limit
      items
    };
  }

  checkStorageHealth(): {
    available: boolean;
    type: 'local' | 'session' | 'memory';
    quotaExceeded: boolean;
  } {
    try {
      const testKey = `${this.config.prefix}healthcheck`;
      const testData = 'x'.repeat(1024); // 1KB of data

      // Try writing test data
      this.currentStorage.setItem(testKey, testData);
      this.currentStorage.removeItem(testKey);

      return {
        available: true,
        type: this.currentStorage instanceof MemoryStorage 
          ? 'memory'
          : this.currentStorage === localStorage
            ? 'local'
            : 'session',
        quotaExceeded: false
      };
    } catch (error) {
      return {
        available: false,
        type: this.currentStorage instanceof MemoryStorage ? 'memory' : 'local',
        quotaExceeded: error instanceof Error && 
          error.name === 'QuotaExceededError'
      };
    }
  }
}

// Create specialized storage instances
export const watchlistStorage = new StorageService({
  prefix: 'x-stream-watchlist-',
  ttl: 30 * 24 * 60 * 60 * 1000, // 30 days
  fallbackToMemory: true
});

export const cacheStorage = new StorageService({
  prefix: 'x-stream-cache-',
  ttl: 60 * 60 * 1000, // 1 hour
  fallbackToMemory: true
});

// Utility functions for common storage operations
export const storage = {
  // Watchlist operations
  saveToWatchlist(movie: Movie | SearchResult): boolean {
    const watchlist = storage.getWatchlist();
    const updated = [...watchlist, movie];
    return watchlistStorage.set('items', updated);
  },

  removeFromWatchlist(movieId: string): void {
    const watchlist = storage.getWatchlist();
    const updated = watchlist.filter(item => item.id.toString() !== movieId);
    watchlistStorage.set('items', updated);
  },

  getWatchlist(): (Movie | SearchResult)[] {
    return watchlistStorage.get<(Movie | SearchResult)[]>('items') || [];
  },

  isInWatchlist(movieId: string): boolean {
    const watchlist = storage.getWatchlist();
    return watchlist.some(item => item.id.toString() === movieId);
  },

  // Continue watching operations
  saveProgress(movieId: string, progress: number): boolean {
    const key = `progress-${movieId}`;
    return cacheStorage.set(key, {
      progress,
      lastWatched: new Date().toISOString()
    });
  },

  getProgress(movieId: string): { progress: number; lastWatched: string } | null {
    const key = `progress-${movieId}`;
    return cacheStorage.get(key);
  },

  // Search history
  saveSearchQuery(query: string): boolean {
    const searches = storage.getSearchHistory();
    const updated = [query, ...searches.filter(q => q !== query)].slice(0, 10);
    return cacheStorage.set('search-history', updated);
  },

  getSearchHistory(): string[] {
    return cacheStorage.get<string[]>('search-history') || [];
  },

  clearSearchHistory(): void {
    cacheStorage.remove('search-history');
  },

  // Cache operations for API responses
  setCacheItem<T>(key: string, data: T): boolean {
    return cacheStorage.set(key, data);
  },

  getCacheItem<T>(key: string): T | null {
    return cacheStorage.get<T>(key);
  },

  // Storage maintenance and health checks
  cleanup(): void {
    watchlistStorage.clearExpired();
    cacheStorage.clearExpired();
  },

  checkHealth(): {
    watchlist: ReturnType<StorageService['checkStorageHealth']>;
    cache: ReturnType<StorageService['checkStorageHealth']>;
  } {
    return {
      watchlist: watchlistStorage.checkStorageHealth(),
      cache: cacheStorage.checkStorageHealth()
    };
  }
};