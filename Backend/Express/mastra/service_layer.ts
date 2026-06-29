import { fieldsTable, sectionsTable } from "../drizzle/src/db/schema";
import { db } from "../drizzle/index";
import { eq } from "drizzle-orm";


export async function createSection(data: {
  title: string;
  description?: string;
}) {
  try {
    const [section] = await db
      .insert(sectionsTable)
      .values({
        id: crypto.randomUUID(),
        ...data,
      })
      .returning();

    return {
      success: true,
      message: "Section created successfully",
      data: section,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create section",
    };
  }
}

export async function createField(data: {
  label: string;
  type: string;
  sectionId: string;
  options?: string[];
}) {
  try {
    const [field] = await db
      .insert(fieldsTable)
      .values({
        id: crypto.randomUUID(),
        ...data,
      })
      .returning();

    return {
      success: true,
      message: "Field created successfully",
      data: field,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create field",
    };
  }
}

export async function getSections() {
  try {
    const sections = await db.select().from(sectionsTable);
    return {
      success: true,
      message: "Sections fetched successfully",
      data: sections,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get sections",
    };
  }
}
export async function getFields() {
  try {
    const fields = await db.select().from(fieldsTable);
    return {
      success: true,
      message: "Fields fetched successfully",
      data: fields,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get fields",
    };
  }
}

export async function updateSection(id: string, data: {
  title?: string;
  description?: string;
  order?: number;
}) {
  try {
    const [section] = await db
      .update(sectionsTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(sectionsTable.id, id))
      .returning();

    if (!section) {
      return {
        success: false,
        message: "Section not found",
      };
    }

    return {
      success: true,
      message: "Section updated successfully",
      data: section,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update section",
    };
  }
}

export async function deleteSection(id: string) {
  try {
    const [section] = await db
      .delete(sectionsTable)
      .where(eq(sectionsTable.id, id))
      .returning();

    if (!section) {
      return {
        success: false,
        message: "Section not found",
      };
    }

    return {
      success: true,
      message: "Section deleted successfully",
      data: section,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete section",
    };
  }
}

export async function updateField(id: string, data: {
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  sectionId?: string;
  order?: number;
}) {
  try {
    const [field] = await db
      .update(fieldsTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(fieldsTable.id, id))
      .returning();

    if (!field) {
      return {
        success: false,
        message: "Field not found",
      };
    }

    return {
      success: true,
      message: "Field updated successfully",
      data: field,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update field",
    };
  }
}

export async function deleteField(id: string) {
  try {
    const [field] = await db
      .delete(fieldsTable)
      .where(eq(fieldsTable.id, id))
      .returning();

    if (!field) {
      return {
        success: false,
        message: "Field not found",
      };
    }

    return {
      success: true,
      message: "Field deleted successfully",
      data: field,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete field",
    };
  }
}
