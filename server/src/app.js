import express from "express";
import cors from "cors";
import departmentRoutes from "./routes/DepartmentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import UserRoutes from "./routes/UserRoutes.js";
import subjectRoutes from "./routes/SubjectRoutes.js";
import noteRoutes from "./routes/NoteRoutes.js";
import cookieParser from "cookie-parser";
import downloadHistoryRoutes from "./routes/downloadHistoryRoutes.js"
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "StudySnap API is running",
  });
});
app.use("/auth", authRoutes);
app.use("/users", UserRoutes);
app.use("/departments", departmentRoutes);
app.use("/subjects", subjectRoutes);
app.use("/notes", noteRoutes);
app.use("/downloads", downloadHistoryRoutes)

//place the error middleware at the end, after all routes
app.use(errorMiddleware);
export default app;