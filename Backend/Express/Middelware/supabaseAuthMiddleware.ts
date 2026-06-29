import type { Request, Response, NextFunction } from "express";
import supabase from "../config/supabaseClient.js";

export const supabaseAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log("token", token)
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const supabaseClient = supabase(token);
        const { data, error } = await supabaseClient.auth.getUser(token);
        if (error) {
            return res.status(401).json({
                message: error.message
            });
        }
        console.log("userSdata", data);


        req.user = {
            id: data.user.id,
            email: data.user.email ?? "",
        };
        req.client = supabaseClient;
        next();
    } catch (error: any) {
        return res.status(401).json({
            message: error.message
        });
    }
}
