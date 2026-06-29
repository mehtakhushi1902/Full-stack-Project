import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { createField, createSection, getFields, getSections, updateField, deleteField, updateSection, deleteSection } from "./service_layer";

export const createSectionTool = createTool({
    id: "create-section",

    description: "Create a form section",

    inputSchema: z.object({
        title: z.string().min(1, "Section title is required"),
        description: z.string().optional(),
    }),

    execute: async (data) => {
        return await createSection(data);
    },
});

export const createFieldTool = createTool({
    id: "create-field",

    description: "Create a field inside a section",

    inputSchema: z.object({
        label: z.string().min(1, "Field label is required"),
        type: z.enum([
            "text",
            "number",
            "email",
            "dropdown",
            "paragraph",
            "checkbox",
            "date",
        ]),
        sectionName: z.string().min(1, "Section Name is required"),
        options: z.array(z.string()).optional(),
    }),

    execute: async (data) => {
        console.log("Data in fields for section", data)
        const sections = await getSections();
        if (sections.success === false) {
            throw new Error(sections.message);
        }
        if (sections != undefined && sections.data?.length === 0) {
            throw new Error("No sections found");
        }
        const section = sections?.data?.find(
            s => s.title.toLowerCase() ===
                data.sectionName.toLowerCase()
        );

        if (!section) {
            throw new Error(
                `Section '${data.sectionName}' not found`
            );
        }

        return createField({
            label: data.label,
            type: data.type,
            sectionId: section.id,
            options: data?.options,
        });
    },
});

export const getSectionTool = createTool({
    id: "get-sections",

    description:
        "Get all sections",

    execute: async () => {
        return getSections();
    },
});

export const getFieldTool = createTool({
    id: "get-fields",

    description:
        "Get all fields",

    execute: async () => {
        return getFields();
    },
});

export const updateSectionTool = createTool({
    id: "update-section",
    description: "Update an existing form section's title, description, or order",
    inputSchema: z.object({
        currentTitle: z.string().min(1, "Current section title is required to find it"),
        newTitle: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        order: z.number().nullable().optional(),
    }),
    execute: async (data) => {
        const sections = await getSections();
        if (sections.success === false) {
            throw new Error(sections.message);
        }
        const section = sections?.data?.find(
            s => s.title.toLowerCase() === data.currentTitle.toLowerCase()
        );
        if (!section) {
            throw new Error(`Section with title '${data.currentTitle}' not found`);
        }
        return await updateSection(section.id, {
            title: data.newTitle || undefined,
            description: data.description || undefined,
            order: data.order !== null ? data.order : undefined,
        });
    },
});

export const deleteSectionTool = createTool({
    id: "delete-section",
    description: "Delete a form section by its title",
    inputSchema: z.object({
        title: z.string().min(1, "Section title is required"),
    }),
    execute: async (data) => {
        const sections = await getSections();
        if (sections.success === false) {
            throw new Error(sections.message);
        }
        const section = sections?.data?.find(
            s => s.title.toLowerCase() === data.title.toLowerCase()
        );
        if (!section) {
            throw new Error(`Section with title '${data.title}' not found`);
        }
        return await deleteSection(section.id);
    },
});

export const updateFieldTool = createTool({
    id: "update-field",
    description: "Update an existing field inside a specific section",
    inputSchema: z.object({
        currentLabel: z.string().min(1, "Current field label is required to find it"),
        sectionName: z.string().min(1, "Section Name where field resides is required"),
        newLabel: z.string().nullable().optional(),
        newSectionName: z.string().nullable().optional(),
        type: z.enum([
            "text",
            "number",
            "email",
            "dropdown",
            "paragraph",
            "checkbox",
            "date",
        ]).nullable().optional(),
        placeholder: z.string().nullable().optional(),
        required: z.boolean().nullable().optional(),
        options: z.array(z.string()).nullable().optional(),
    }),
    execute: async (data) => {
        const sections = await getSections();
        if (sections.success === false) {
            throw new Error(sections.message);
        }
        const currentSection = sections?.data?.find(
            s => s.title.toLowerCase() === data.sectionName.toLowerCase()
        );
        if (!currentSection) {
            throw new Error(`Section '${data.sectionName}' not found`);
        }

        const fields = await getFields();
        if (fields.success === false) {
            throw new Error(fields.message);
        }
        const field = fields?.data?.find(
            f => f.label.toLowerCase() === data.currentLabel.toLowerCase() && f.sectionId === currentSection.id
        );
        if (!field) {
            throw new Error(`Field '${data.currentLabel}' not found in section '${data.sectionName}'`);
        }

        let newSectionId: string | undefined = undefined;
        if (data.newSectionName) {
            const targetSection = sections?.data?.find(
                s => s.title.toLowerCase() === data.newSectionName!.toLowerCase()
            );
            if (!targetSection) {
                throw new Error(`Target section '${data.newSectionName}' not found`);
            }
            newSectionId = targetSection.id;
        }


        return await updateField(field.id, {
            label: data.newLabel || undefined,
            sectionId: newSectionId || undefined,
            type: data.type || undefined,
            placeholder: data.placeholder || undefined,
            required: data.required !== null ? data.required : undefined,
            options: data.options || undefined,
        });
    },
});

export const deleteFieldTool = createTool({
    id: "delete-field",
    description: "Delete a field from a section",
    inputSchema: z.object({
        label: z.string().min(1, "Field label to delete is required"),
        sectionName: z.string().min(1, "Section Name where field resides is required"),
    }),
    execute: async (data) => {
        // Find current section
        const sections = await getSections();
        if (sections.success === false) {
            throw new Error(sections.message);
        }
        const section = sections?.data?.find(
            s => s.title.toLowerCase() === data.sectionName.toLowerCase()
        );
        if (!section) {
            throw new Error(`Section '${data.sectionName}' not found`);
        }

        // Find current field in this section
        const fields = await getFields();
        if (fields.success === false) {
            throw new Error(fields.message);
        }
        const field = fields?.data?.find(
            f => f.sectionId === section.id && f.label.toLowerCase() === data.label.toLowerCase()
        );
        if (!field) {
            throw new Error(`Field '${data.label}' not found in section '${data.sectionName}'`);
        }

        return await deleteField(field.id);
    },
});

