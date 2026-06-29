import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";

import projectRoutes from "./Routes/project";
import tokenRoutes from "./Routes/authtoken";
import agentRoutes from "./Routes/agent_route"
import paymentRoutes from "./Routes/paymentRoutes"
import sectionRoutes from "./Routes/section";
import fieldRoutes from "./Routes/fields";
import cors from "cors";
import type { Request, Response } from "express";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the API" })
})
app.use("/auth", tokenRoutes)
app.use("/sections", sectionRoutes);
app.use("/fields", fieldRoutes);
app.use("/agent", agentRoutes);
app.use("/projects", projectRoutes);
app.use("/payments", paymentRoutes)

app.listen(3000, () => {
  console.log("Server running on port 3000");
});