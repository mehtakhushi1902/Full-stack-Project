
import type { Request, Response } from "express";
import { projectsTable } from "../drizzle/src/db/schema";
import { eq } from "drizzle-orm";
import supabase from "../config/supabaseClient";


export const UpdateProject = async (
    req: Request,
    res: Response
) => {
    try {
        const { name } = req.body;

        // const result = await req.db?.update(projectsTable).set({
        //     name: name,
        // }).where(eq(projectsTable.id, Number(req.params.id)));

        const { data: updatedProject, error: updateError } =
            await req.client
                .from("projects")
                .update({
                    // owner_id: req.user.id,
                    name
                })
                .eq("id", req.params.id)
                .select()
        // .single();

        if (updateError) {
            return res.status(400).json({
                error: updateError.message
            });
        }
        return res.json(updatedProject);
    } catch (error) {
        res.status(500).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error",
        });
    }
};

export const GetProjects = async (req: Request, res: Response) => {
    try {
        // const result = await req.db?.select().from(projectsTable);

        const { data: getProject, error } = await req.client.from("projects").select("*")

        console.log("error", error);
        if (error) {
            return res.status(400).json({
                error: error.message
            });
        }
        return res.json(getProject);
    } catch (err: any) {
        return res.status(500).json({
            message: err.message,
        });
    }
}

// Postgresql Policy

// export const createProject = async (req: Request, res: Response) => {
//     try {
//         const { name } = req.body;

//         const result = await req.db?.insert(projectsTable).values({
//             name: name,
//             ownerId: req.user.id
//         });

//         res.json(result);
//     } catch (error) {
//         res.status(500).json({
//             message:
//                 error instanceof Error
//                     ? error.message
//                     : "Unknown error",
//         });
//     }
// }


export const createProject = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        // const result = await req.db?.insert(projectsTable).values({
        //     name: name,
        //     ownerId: req.user.id
        // });


        const { data: insertedProject, error: insertError } =
            await req.client
                .from("projects")
                .insert({
                    owner_id: req.user.id,
                    name
                })
                .select()
                .single();

        if (insertError) {
            return res.status(400).json({
                error: insertError.message
            });
        }
        return res.json(insertedProject);
    } catch (error) {
        res.status(500).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error",
        });
    }
}