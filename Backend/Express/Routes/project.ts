
import { Router } from "express";

import { UpdateProject, GetProjects, createProject } from "../Controller/project";

import { authMiddleware, generateToken } from "../Middelware/authmiddleware";

import { rlsMiddleware } from "../Middelware/rlsmiddelware";
import { supabaseAuthMiddleware } from "../Middelware/supabaseAuthMiddleware";

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