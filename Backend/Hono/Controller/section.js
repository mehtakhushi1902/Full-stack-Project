import { eq, asc } from "drizzle-orm";
import { sectionsTable } from "../drizzle/src/db/schema.js";
import { db } from "../drizzle/index.js";

const getSections = async (c) => {
    try {
        const result = await db.select().from(sectionsTable).orderBy(asc(sectionsTable.order));
        return c.json(result);
    } catch (error) {
        console.log(error);
        return c.json({ message: error.message })
    }
}
const getSection = async (c) => {
    const { id } = await c.req.param();
    try {
        const result = await db
            .select()
            .from(sectionsTable)
            .where(eq(sectionsTable.id, id));
        if (result.length === 0) return c.status(404).json({ message: "Section not found" });
        return c.json(result[0]);
    } catch (error) {
        console.log(error);
        return c.json({ message: error.message })
    }
}
const createSection = async (c) => {
    try {
        const { id: _id, createdAt, updatedAt, ...body } = await c.req.json();
        const crypto_id = crypto.randomUUID()
        const [created] = await db
            .insert(sectionsTable)
            .values({ id: crypto_id, ...body })
            .returning();
        return c.json(created);
    } catch (error) {
        console.log(error);
        return c.json({ message: error.message })
    }
}
const updateSection = async (c) => {
    const { id } = await c.req.param();
    try {
        const { id: _id, createdAt, updatedAt, ...updates } = await c.req.json();
        const [updated] = await db
            .update(sectionsTable)
            .set(updates)
            .where(eq(sectionsTable.id, id))
            .returning();
        if (!updated) return c.status(404).json({ message: "Section not found" });
        return c.json(updated);
    } catch (error) {
        console.log(error);
        return c.json({ message: error.message })
    }
}
const deleteSection = async (c) => {
    const { id } = await c.req.param();
    try {
        const [deleted] = await db
            .delete(sectionsTable)
            .where(eq(sectionsTable.id, id))
            .returning();
        if (!deleted) return c.status(404).json({ message: "Section not found" });
        return c.json(deleted);
    } catch (error) {
        console.log(error);
        return c.json({ message: error.message })
    }
}

const reorderSections = async (c) => {
    try {
        const updates = await c.req.json();
        const results = await Promise.all(
            updates.map(update =>
                db.update(sectionsTable)
                  .set({ order: update.order })
                  .where(eq(sectionsTable.id, update.id))
                  .returning()
            )
        );
        return c.json({ message: "Reordered successfully" });
    } catch (error) {
        console.log(error);
        return c.json({ message: error.message })
    }
}

export { getSections, getSection, createSection, updateSection, deleteSection, reorderSections }