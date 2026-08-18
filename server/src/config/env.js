require("dotenv").config();

const env = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGODB_URI
};

module.exports = env;