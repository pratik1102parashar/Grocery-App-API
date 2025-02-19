import express from "express";
import { connectDB } from "./utils/database";
import adminRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());


connectDB();
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

export default app;
