import type { NodePgDatabase } from "drizzle-orm/node-postgres";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
            };

            db?: NodePgDatabase;
        }
    }
}

export { };