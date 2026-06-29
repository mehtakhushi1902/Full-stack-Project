import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { SupabaseClient } from "@supabase/supabase-js";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };

            db?: NodePgDatabase;
            client?: SupabaseClient;
        }
    }
}

export { };