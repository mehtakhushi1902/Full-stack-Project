import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../drizzle/index.js";
import { openAPI } from "better-auth/plugins"
import * as schema from "../drizzle/src/db/schema.js";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },

    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema
    }),
    plugins: [
        openAPI(),
    ]
});