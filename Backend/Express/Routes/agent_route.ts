import { Router } from "express";
import chatController from "../mastra/controller.ts";

const router = Router();
router.post(
    "/chat",
    chatController
)


export default router;