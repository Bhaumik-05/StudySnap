import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = 3000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected to server.js");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Error:", error.message);
  }
};

startServer();