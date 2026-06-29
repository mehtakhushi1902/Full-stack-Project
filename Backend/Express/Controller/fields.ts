import type { Request, Response } from "express";
import { asc, eq } from "drizzle-orm";
import { fieldsTable } from "../drizzle/src/db/schema";
import { db } from "../drizzle/index";
import { randomUUID } from "crypto";

export const getFields = async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(fieldsTable);
    return res.json(result);
  } catch (error: any) {
    console.log(error);
    return res.json({ message: error.message })
  }
};

export const getField = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await db
      .select()
      .from(fieldsTable)
      .where(eq(fieldsTable.id, id));
    if (result.length === 0) return res.status(404).json({ message: "Field not found" });
    return res.json(result[0]);
  } catch (error: any) {
    console.log(error);
    return res.json({ message: error.message })
  }
};

export const createField = async (req: Request, res: Response) => {
  try {
    const { id: _id, createdAt, updatedAt, ...body } = req.body;
    const [created] = await db
      .insert(fieldsTable)
      .values({ id: randomUUID(), ...body })
      .returning();
    return res.status(201).json(created);
  } catch (error: any) {
    console.log(error);
    return res.json({ message: error.message })
  }
};

export const updateField = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { id: _id, createdAt, updatedAt, ...updates } = req.body;
    const [updated] = await db
      .update(fieldsTable)
      .set(updates)
      .where(eq(fieldsTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ message: "Field not found" });
    return res.json(updated);
  } catch (error: any) {
    console.log(error);
    return res.json({ message: error.message })
  }
};

export const deleteField = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [deleted] = await db
      .delete(fieldsTable)
      .where(eq(fieldsTable.id, id))
      .returning();
    if (!deleted) return res.status(404).json({ message: "Field not found" });
    return res.json(deleted);
  } catch (error: any) {
    console.log(error);
    return res.json({ message: error.message })
  }
};

export const getAllFieldsBySectionId = async (req: Request, res: Response) => {
  const { sectionId } = req.params;
  try {
    const result = await db.select().from(fieldsTable).where(eq(fieldsTable.sectionId, sectionId)).orderBy(asc(fieldsTable.order));
    return res.json(result);
  } catch (error: any) {
    console.log(error);
    return res.json({ message: error.message })
  }
}

export const reorderFields = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    console.log("updates", updates)
    const results = await Promise.all(
      updates.map(update =>
        db.update(fieldsTable)
          .set({ order: update.order, ...(update.sectionId ? { sectionId: update.sectionId } : {}) })
          .where(eq(fieldsTable.id, update.id))
          .returning()
      )
    );
    console.log("resultss", results)
    return res.json({ message: "Reordered successfully" });
  } catch (error: any) {
    console.log(error);
    return res.json({ message: error.message })
  }
}
