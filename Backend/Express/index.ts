import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";

import projectRoutes from "./Routes/project.ts";
import tokenRoutes from "./Routes/authtoken.ts";
import agentRoutes from "./Routes/agent_route.ts"
import paymentRoutes from "./Routes/paymentRoutes.ts"
import sectionRoutes from "./Routes/section.ts";
import fieldRoutes from "./Routes/fields.ts";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/", tokenRoutes)
app.use("/sections", sectionRoutes);
app.use("/fields", fieldRoutes);
app.use("/agent", agentRoutes);
app.use("/projects", projectRoutes);
app.use("/payments", paymentRoutes)

app.listen(3000, () => {
  console.log("Server running on port 3000");
});