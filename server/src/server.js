const app = require("./app");
const connectDB = require("./config/db");
const Department = require("./models/Departments");

const PORT = 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error(error.message);
  }
};

startServer();