import express from "express";
import cors from "cors";
import departmentRoutes from "./routes/DepartmentRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/departments", departmentRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "StudySnap API is running",
  });
});

export default app;