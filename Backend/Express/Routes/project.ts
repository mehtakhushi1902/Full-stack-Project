
import { Router } from "express";

import { UpdateProject, GetProjects, createProject } from "../Controller/project.ts";

import { authMiddleware, generateToken } from "../Middelware/authmiddleware.ts";

import { rlsMiddleware } from "../Middelware/rlsmiddelware.ts";
import { supabaseAuthMiddleware } from "../Middelware/supabaseAuthMiddleware.ts";

const router = Router();

router.put(
    "/:id",
    // authMiddleware,
    // rlsMiddleware,
    supabaseAuthMiddleware,
    UpdateProject
);

router.get(
    "/",
    // authMiddleware,
    // rlsMiddleware,
    supabaseAuthMiddleware,
    GetProjects
);

router.post(
    "/",
    // authMiddleware,
    // rlsMiddleware,
    supabaseAuthMiddleware,
    createProject
)

export default router;