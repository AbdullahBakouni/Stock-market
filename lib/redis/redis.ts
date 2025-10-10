// lib/redis.ts
import Redis from "ioredis";

// Create a single shared Redis instance

declare global {
  var _redis: Redis | undefined;
}

if (!global._redis) {
  global._redis = new Redis(process.env.REDIS_URL || "");
}

const redis: Redis = global._redis;

export default redis;
