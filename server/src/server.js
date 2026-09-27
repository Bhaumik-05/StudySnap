import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected to server.js");

    app.listen(env.PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${env.PORT}`);
    });

  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

startServer();