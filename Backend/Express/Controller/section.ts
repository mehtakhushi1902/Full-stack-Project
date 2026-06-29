import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { sectionsTable } from "../drizzle/src/db/schema.js";
import { db } from "../drizzle/index.js";
import { randomUUID } from "crypto";


export const getSections = async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(sectionsTable);
    return res.json(result);
  } catch (error: any) {
    console.log(error);
    return res.json({ message: error.message })
  }
};

export const getSection = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await db
      .select()
      .from(sectionsTable)
      .where(eq(sectionsTable.id, String(id)));
    if (result.length === 0) return res.status(404).json({ message: "Section not found" });
    return res.json(result[0]);
  } catch (error: any) {
    console.log(error);
    return res.json({ message: error.message })
  }
};

export const createSection = async (req: Request, res: Response) => {
  try {
    const { id: _id, createdAt, updatedAt, ...body } = req.body;
    const [created] = await db
      .insert(sectionsTable)
      .values({ id: randomUUID(), ...body })
      .returning();
    return res.status(201).json(created);
  } catch (error: any) {
    console.log(error);
    return res.json({ message: error.message })
  }
};

export const updateSection = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { id: _id, createdAt, updatedAt, ...updates } = req.body;
    const [updated] = await db
      .update(sectionsTable)
      .set(updates)
      .where(eq(sectionsTable.id, String(id)))
      .returning();
    if (!updated) return res.status(404).json({ message: "Section not found" });
    return res.json(updated);
  } catch (error: any) {
    console.log(error);
    return res.json({ message: error.message })
  }
};

export const deleteSection = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [deleted] = await db
      .delete(sectionsTable)
      .where(eq(sectionsTable.id, String(id)))
      .returning();
    if (!deleted) return res.status(404).json({ message: "Section not found" });
    return res.json(deleted);
  } catch (error: any) {
    console.log(error);
    return res.json({ message: error.message })
  }
};


export const reorderSections = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const results = await Promise.all(
      updates.map((update: { id: string; order: number }) =>
        db.update(sectionsTable)
          .set({ order: update.order })
          .where(eq(sectionsTable.id, update.id))
          .returning()
      )
    );
    return res.json({ message: "Reordered successfully" });
  } catch (error: any) {
    console.log(error);
    return res.json({ message: error.message })
  }
}