import {
    boolean,
    jsonb,
    pgTable,
    text,
    timestamp,
    varchar,
    integer,
    uuid,
} from "drizzle-orm/pg-core";

export const sectionsTable = pgTable("sections", {
    id: varchar("id", { length: 100 }).primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    order: integer("order").default(0).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const fieldsTable = pgTable("fields", {
    id: varchar("id", { length: 100 }).primaryKey(),

    label: varchar("label", { length: 255 }).notNull(),

    type: varchar("type", {
        length: 50,
    }).notNull(),

    placeholder: text("placeholder"),

    required: boolean("required").default(false).notNull(),

    options: jsonb("options"),

    sectionId: varchar("section_id", { length: 100 })
        .notNull()
        .references(() => sectionsTable.id, {
            onDelete: "cascade",
        }),

    order: integer("order").default(0).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey(),
    // name: varchar({ length: 255 }).notNull(),
    // age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
});


export const projectsTable = pgTable("projects", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),

    ownerId: uuid("owner_id")
        .notNull()
        .references(() => usersTable.id),

    name: varchar({ length: 255 }).notNull(),
});

