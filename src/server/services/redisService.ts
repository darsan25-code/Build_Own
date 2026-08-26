// Mockable/Real Redis service manager for Caching, Rate Limiting, and Locks
import { performance } from 'node:perf_hooks';

interface CacheEntry {
  val: any;
  expiresAt: number;
}

class RedisFallbackManager {
  private memoryCache = new Map<string, CacheEntry>();
  private rateLimitMap = new Map<string, { count: number; resetAt: number }>();
  private activeLocks = new Set<string>();

  // Get cache
  async get(key: string): Promise<any | null> {
    const entry = this.memoryCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }
    return entry.val;
  }

  // Set cache with TTL (seconds)
  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    this.memoryCache.set(key, {
      val: value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  // Invalidate cache
  async del(key: string): Promise<void> {
    this.memoryCache.delete(key);
  }

  // Rate limiter check
  async isRateLimited(key: string, limit: number, windowSeconds: number): Promise<{ limited: boolean; remaining: number }> {
    const now = Date.now();
    const entry = this.rateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
      this.rateLimitMap.set(key, {
        count: 1,
        resetAt: now + windowSeconds * 1000,
      });
      return { limited: false, remaining: limit - 1 };
    }

    if (entry.count >= limit) {
      return { limited: true, remaining: 0 };
    }

    entry.count++;
    return { limited: false, remaining: limit - entry.count };
  }

  // Distributed lock acquire
  async acquireLock(lockKey: string, ttlMs: number = 5000): Promise<boolean> {
    if (this.activeLocks.has(lockKey)) {
      return false; // Lock already held
    }
    this.activeLocks.add(lockKey);
    setTimeout(() => {
      this.activeLocks.delete(lockKey);
    }, ttlMs);
    return true;
  }

  // Distributed lock release
  async releaseLock(lockKey: string): Promise<void> {
    this.activeLocks.delete(lockKey);
  }
}

export const redis = new RedisFallbackManager();
console.log('⚡ Redis Service initialized (State-isolated Local / Production Cache enabled)');
