import { Router } from "express";
import chatController from "../mastra/controller";

const router = Router();
router.post(
    "/chat",
    chatController
)


export default router;