import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { usersTable } from "../drizzle/src/db/schema.ts";
import { eq } from "drizzle-orm";

import { db } from "../drizzle/index.ts";

interface JwtPayload {
    sub: string;
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;


        const result = await db.select().from(usersTable).where(eq(usersTable.id, payload.sub));

        if (result.length === 0) {
            res.status(401).json({
                message: "User not found",
            });
            return;
        }

        req.user = {
            id: result[0].id,
            email: result[0].email,
        };

        next();
    } catch (error) {
        console.log("error", error);
        res.status(401).json({
            message: "Invalid token",
        });
    }
};

export const generateToken = (
    id: number,
    email: string,
    // role: string
): string => {
    return jwt.sign(
        {
            sub: id,
            email,
            // role
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "7d"
        }
    );
};