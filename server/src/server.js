import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";

const PORT = 3000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected to server.js");

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });

  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

startServer();