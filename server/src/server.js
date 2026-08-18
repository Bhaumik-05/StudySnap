const express = require("express");
const connectDB = require("./config/db");
const env = require("./config/env");

const app = express();

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error(error.message);
  }
};

startServer();