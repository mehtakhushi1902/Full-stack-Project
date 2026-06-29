import { Router } from "express";
import chatController from "../mastra/controller.js";

const router = Router();
router.post(
    "/chat",
    chatController
)


export default router;