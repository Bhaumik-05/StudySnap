import { describe, it, expect, beforeEach, vi } from "vitest";

import redisClient from "../../src/config/redisClient.js";
import {
    blacklistAccessToken,
    isAccessTokenBlacklisted,
} from "../../src/utils/tokenBlacklist.js";

vi.mock("../../src/config/redisClient.js", () => ({
    default: {
        set: vi.fn(),
        get: vi.fn(),
    },
}));

describe("tokenBlacklist", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("blacklistAccessToken", () => {
        it("should blacklist an access token using Redis SET", async () => {
            redisClient.set.mockResolvedValue("OK");

            await blacklistAccessToken("token-jti-123", 900);

            expect(redisClient.set).toHaveBeenCalledTimes(1);
        });

        it("should generate the correct Redis blacklist key", async () => {
            redisClient.set.mockResolvedValue("OK");

            await blacklistAccessToken("abc123", 900);

            expect(redisClient.set).toHaveBeenCalledWith(
                "blacklist:abc123",
                "true",
                {
                    EX: 900,
                }
            );
        });

        it("should use the supplied expiration time as the Redis TTL", async () => {
            redisClient.set.mockResolvedValue("OK");

            await blacklistAccessToken("ttl-test-jti", 120);

            expect(redisClient.set).toHaveBeenCalledWith(
                "blacklist:ttl-test-jti",
                "true",
                {
                    EX: 120,
                }
            );
        });

        it("should create an independent blacklist key for different token JTIs", async () => {
            redisClient.set.mockResolvedValue("OK");

            await blacklistAccessToken("jti-one", 300);
            await blacklistAccessToken("jti-two", 600);

            expect(redisClient.set).toHaveBeenNthCalledWith(
                1,
                "blacklist:jti-one",
                "true",
                {
                    EX: 300,
                }
            );

            expect(redisClient.set).toHaveBeenNthCalledWith(
                2,
                "blacklist:jti-two",
                "true",
                {
                    EX: 600,
                }
            );
        });

        it("should propagate an error when Redis SET fails", async () => {
            const redisError = new Error(
                "Redis SET operation failed"
            );

            redisClient.set.mockRejectedValue(redisError);

            await expect(
                blacklistAccessToken("failed-jti", 900)
            ).rejects.toThrow("Redis SET operation failed");

            expect(redisClient.set).toHaveBeenCalledWith(
                "blacklist:failed-jti",
                "true",
                {
                    EX: 900,
                }
            );
        });
    });

    describe("isAccessTokenBlacklisted", () => {
        it("should return true when the blacklist key exists", async () => {
            redisClient.get.mockResolvedValue("true");

            const result = await isAccessTokenBlacklisted(
                "existing-jti"
            );

            expect(result).toBe(true);

            expect(redisClient.get).toHaveBeenCalledWith(
                "blacklist:existing-jti"
            );
        });

        it("should return false when the blacklist key does not exist", async () => {
            redisClient.get.mockResolvedValue(null);

            const result = await isAccessTokenBlacklisted(
                "missing-jti"
            );

            expect(result).toBe(false);

            expect(redisClient.get).toHaveBeenCalledWith(
                "blacklist:missing-jti"
            );
        });

        it("should treat any non-null Redis value as blacklisted", async () => {
            redisClient.get.mockResolvedValue("");

            const result = await isAccessTokenBlacklisted(
                "empty-value-jti"
            );

            expect(result).toBe(true);
        });

        it("should propagate an error when Redis GET fails", async () => {
            const redisError = new Error(
                "Redis GET operation failed"
            );

            redisClient.get.mockRejectedValue(redisError);

            await expect(
                isAccessTokenBlacklisted("failed-get-jti")
            ).rejects.toThrow("Redis GET operation failed");

            expect(redisClient.get).toHaveBeenCalledWith(
                "blacklist:failed-get-jti"
            );
        });

        it("should use the exact JTI when looking up a blacklist entry", async () => {
            redisClient.get.mockResolvedValue(null);

            await isAccessTokenBlacklisted(
                "exact-jti-value-456"
            );

            expect(redisClient.get).toHaveBeenCalledTimes(1);

            expect(redisClient.get).toHaveBeenCalledWith(
                "blacklist:exact-jti-value-456"
            );
        });
    });
});

