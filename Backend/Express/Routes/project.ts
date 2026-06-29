
import { Router } from "express";

import { UpdateProject, GetProjects, createProject } from "../Controller/project.js";

import { authMiddleware, generateToken } from "../Middelware/authmiddleware.js";

import { rlsMiddleware } from "../Middelware/rlsmiddelware.js";
import { supabaseAuthMiddleware } from "../Middelware/supabaseAuthMiddleware.js";

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