import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { generateToken } from "../Middelware/authmiddleware";
import { eq } from "drizzle-orm";
import { usersTable } from "../drizzle/src/db/schema";
import { db } from "../drizzle/index";
import supabase from "../config/supabaseClient";

// export const login = async (
//     req: Request,
//     res: Response
// ) => {
//     const result = await db.select().from(usersTable).where(eq(usersTable.email, req.body.email));

//     if (result.length === 0) {
//         return res.status(404).json({
//             message: "User not found"
//         });
//     }

//     const user = result[0];

//     const token = generateToken(
//         user.id,
//         user.email,
//         // user.role
//     );

//     // res.cookie("access_token", token, {
//     //     httpOnly: true
//     // });

//     return res.json({
//         success: true,
//         token
//     });
// };


export const login = async (
    req: Request,
    res: Response
) => {
    try {

        // if (result.length === 0) {
        //     try {
        //         await db.insert(usersTable).values({
        //             name: req.body.name,
        //             email: req.body.email,
        //             age: req.body.age,
        //             password: req.body.password
        //         });
        //     } catch (error: any) {
        //         return res.status(500).json({
        //             message: "Internal server error"
        //         });
        //     }
        // }
        const supabaseClient = supabase();
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: req.body.email,
            password: req.body.password
        });
        if (error) {
            console.log(error.message)
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.json({
            success: true,
            token: data.session?.access_token
        });
    } catch (error: any) {
        console.log("error in login", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const register = async (
    req: Request,
    res: Response
) => {
    try {

        // const registerd = await supabase.from('users').select().eq('email', req.body.email);

        // if (registerd.length !== 0) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "User already exists"
        //     });
        // }
        const supabaseClient = supabase();
        const { data, error } = await supabaseClient.auth.signUp({
            email: req.body.email,
            password: req.body.password
        });
        if (error) {
            console.log(error.message)
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        const { data: insertedUser, error: insertError } =
            await supabaseClient
                .from('users')
                .insert({
                    email: req.body.email,
                    password: req.body.password,
                    id: data.user?.id
                })
                .select();

        console.log("insertedUser", insertedUser);
        console.log("insertError", insertError);

        return res.status(201).json({
            message: "User created successfully"
        });
    } catch (error: any) {
        console.log("error in register", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}