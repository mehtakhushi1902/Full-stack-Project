import { Router } from "express";
import {
    getFields,
    getField,
    createField,
    updateField,
    deleteField,
    getAllFieldsBySectionId,
    reorderFields,
} from "../Controller/fields";

const router = Router();

router.get("/", getFields);
router.get("/:id", getField);
router.post("/", createField);
router.put("/reorder", reorderFields);
router.put("/:id", updateField);
router.delete("/:id", deleteField);

router.get("/getFields/:sectionId", getAllFieldsBySectionId);

export default router;