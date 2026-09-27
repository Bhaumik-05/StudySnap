import { createClient } from "redis";

import env from "./env.js";

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

/*
 * Connect to Redis when the application starts.
 *
 * IMPORTANT:
 * We only connect if the client is not already connected.
 * This prevents:
 *
 * ClientClosedError
 * Socket already opened
 * duplicate connection attempts
 */
if (!redisClient.isOpen) {
  await redisClient.connect();
}

export default redisClient;