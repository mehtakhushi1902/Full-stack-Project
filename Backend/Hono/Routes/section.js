import { Hono } from 'hono'
import {
    getSections,
    getSection,
    createSection,
    updateSection,
    deleteSection,
    reorderSections
} from "../Controller/section.js";

const router = new Hono();

router.get("/", getSections);
router.get("/:id", getSection);
router.post("/", createSection);
router.put("/reorder", reorderSections);
router.put("/:id", updateSection);
router.delete("/:id", deleteSection);

export default router;