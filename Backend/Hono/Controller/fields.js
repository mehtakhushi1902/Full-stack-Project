import { db } from "../drizzle/index.js";
import { fieldsTable } from "../drizzle/src/db/schema.js";
import { eq, asc } from "drizzle-orm";

const getAllFields = async (c) => {
    try {
        const result = await db.select().from(fieldsTable).orderBy(asc(fieldsTable.order));
        return c.json(result);
    } catch (error) {
        console.log(error);
        return c.json({ message: error.message })
    }
}
const getFieldById = async (c) => {
    const { id } = await c.req.param()
    try {
        const result = await db
            .select()
            .from(fieldsTable)
            .where(eq(fieldsTable.id, id));
        if (result.length === 0) return c.status(404).json({ message: "Field not found" });
        return c.json(result[0]);

    } catch (error) {
        console.log(error);
        return c.json({ message: error.message })
    }
}
const createField = async (c) => {
    try {
        const { id: _id, createdAt, updatedAt, ...body } = await c.req.json();

        console.log(body);
        const crypto_id = crypto.randomUUID();
        const [created] = await db
            .insert(fieldsTable)
            .values({ id: crypto_id, ...body })
            .returning();
        return c.json(created);
    } catch (error) {
        console.log(error);
        return c.json({ message: error.message })
    }
}
const updateField = async (c) => {
    const { id } = await c.req.param();
    try {
        const { id: _id, createdAt, updatedAt, ...updates } = await c.req.json();
        const [updated] = await db
            .update(fieldsTable)
            .set(updates)
            .where(eq(fieldsTable.id, id))
            .returning();
        if (!updated) return c.status(404).json({ message: "Field not found" });
        return c.json(updated);
    } catch (error) {
        console.log(error);
        return c.json({ message: error.message })
    }
}
const deleteField = async (c) => {
    const { id } = await c.req.param();
    try {
        const [deleted] = await db
            .delete(fieldsTable)
            .where(eq(fieldsTable.id, id))
            .returning();
        if (!deleted) return c.status(404).json({ message: "Field not found" });
        return c.json(deleted);
    } catch (error) {
        console.log(error);
        return c.json({ message: error.message })
    }
}

const reorderFields = async (c) => {
    try {
        const updates = await c.req.json();
        const results = await Promise.all(
            updates.map(update =>
                db.update(fieldsTable)
                  .set({ order: update.order, ...(update.sectionId ? { sectionId: update.sectionId } : {}) })
                  .where(eq(fieldsTable.id, update.id))
                  .returning()
            )
        );
        return c.json({ message: "Reordered successfully" });
    } catch (error) {
        console.log(error);
        return c.json({ message: error.message })
    }
}

export { getAllFields, getFieldById, createField, updateField, deleteField, reorderFields }