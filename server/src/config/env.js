import dotenv from "dotenv";

dotenv.config();

const convertToMilliseconds = (duration) => {
  const match = duration.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error(
      `Invalid duration format: ${duration}. Use formats like 15m, 7d, 1h.`
    );
  }

  const value = Number(match[1]);
  const unit = match[2];

  const unitInMilliseconds = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * unitInMilliseconds[unit];
};

const env = {
  PORT: process.env.PORT,

  MONGO_URI: process.env.MONGODB_URI,

  JWT_SECRET: process.env.JWT_SECRET,

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,

  REFRESH_TOKEN_EXPIRES_IN:
    process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  
  REDIS_URL: process.env.REDIS_URL,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,

  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,

  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

export { convertToMilliseconds };

export default env;