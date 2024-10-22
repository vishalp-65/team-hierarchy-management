import { redis } from "../config/redis_config";

// Generic function to get data from Redis cache
export const getFromCache = async <T>(key: string): Promise<T | null> => {
    const cachedData = await redis.get(key);
    if (!cachedData) return null;
    console.log("cache found");
    return JSON.parse(cachedData);
};

// Generic function to set data in Redis cache
export const setCache = async <T>(
    key: string,
    data: T,
    secToExpire: number = 3600
): Promise<void> => {
    await redis.set(key, JSON.stringify(data), "EX", secToExpire); // Set data with expiration
};

// Function to generate a unique cache key based on filters and user
export const generateCacheKey = (
    prefix: string,
    userId: string,
    filters?: any
): string => {
    const filterString = JSON.stringify(filters);
    return `${prefix}:${userId}:${filterString}`;
};

// Clear cache if needed (for update/delete actions)
export const clearCache = async (key: string): Promise<void> => {
    await redis.del(key);
};
