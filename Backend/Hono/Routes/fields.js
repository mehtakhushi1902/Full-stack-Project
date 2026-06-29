
import { Hono } from 'hono';
import { createField, deleteField, getAllFields, getFieldById, updateField, reorderFields } from '../Controller/fields.js';

const router = new Hono();

router.get("/", getAllFields);
router.get("/:id", getFieldById);
router.post("/", createField);
router.put("/:id", updateField);
router.put("/reorder", reorderFields);
router.delete("/:id", deleteField);

export default router;
