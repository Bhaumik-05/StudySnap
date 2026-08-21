import express from "express";
import cors from "cors";
import departmentRoutes from "./routes/DepartmentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import UserRoutes from "./routes/UserRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "StudySnap API is running",
  });
});
app.use("/departments", departmentRoutes);
app.use("/auth", authRoutes);
app.use("/users", UserRoutes);
app.use(errorMiddleware);
export default app;