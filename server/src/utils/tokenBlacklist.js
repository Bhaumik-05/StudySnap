import redisClient from "../config/redisClient.js";

export const blacklistAccessToken = async (jti, expiresInSeconds) => {
  const key = `blacklist:${jti}`;

  await redisClient.set(key, "true", {
    EX: expiresInSeconds,
  });
};

export const isAccessTokenBlacklisted = async (jti) => {
  const key = `blacklist:${jti}`;

  const value = await redisClient.get(key);

  return value !== null;
};
