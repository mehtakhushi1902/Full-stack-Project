import { Router } from "express";
import {
    getSections,
    getSection,
    createSection,
    updateSection,
    deleteSection,
    reorderSections,
} from "../Controller/section";

const router = Router();

router.get("/", getSections);
router.get("/:id", getSection);
router.post("/", createSection);

router.put("/reorder", reorderSections);
router.put("/:id", updateSection);
router.delete("/:id", deleteSection);

export default router;