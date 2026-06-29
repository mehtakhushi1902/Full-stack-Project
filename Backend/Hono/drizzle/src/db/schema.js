import {
    boolean,
    jsonb,
    pgTable,
    text,
    timestamp,
    varchar,
    integer,
    index,
    uuid
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";


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

// export const usersTable = pgTable("users", {
//     id: integer().primaryKey().generatedAlwaysAsIdentity(),
//     name: varchar({ length: 255 }).notNull(),
//     age: integer().notNull(),
//     email: varchar({ length: 255 }).notNull().unique(),
// });


// export const projectsTable = pgTable("projects", {
//     id: integer().primaryKey().generatedAlwaysAsIdentity(),

//     ownerId: integer("owner_id")
//         .notNull()
//         .references(() => usersTable.id),

//     name: varchar({ length: 255 }).notNull(),
// });





// Better auth schema

export const todos = pgTable("todos", {
    id: uuid().primaryKey().defaultRandom(),
    userId: text('user_id').notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    completed: boolean("completed").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
})


export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

