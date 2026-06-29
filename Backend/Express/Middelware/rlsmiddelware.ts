import type { Request, Response, NextFunction } from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { pool } from "../drizzle/index.js";
export const rlsMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const client = await pool.connect();

    try {
        if (!req.user) {
            client.release();

            res.status(401).json({
                message: "Unauthorized",
            });

            return;
        }

        await client.query(
            "select set_config('app.user_id', $1, false)",
            [req.user.id]
        );

        await client.query(
            `SELECT set_config('app.email', $1, false)`,
            [req.user.email]
        );

        req.db = drizzle(client);

        res.on("finish", () => {
            client.release();
        });

        next();
    } catch (err) {
        client.release();
        next(err);
    }
};