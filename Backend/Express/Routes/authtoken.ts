import { Router } from "express";


import { generateToken } from "../Middelware/authmiddleware.ts";
import { login, register } from "../Controller/auth.ts";


const router = Router();
router.post(
    "/login",
    login
)

router.post("/register", register)

export default router;