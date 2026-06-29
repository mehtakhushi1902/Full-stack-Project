import { Router } from "express";


import { generateToken } from "../Middelware/authmiddleware.js";
import { login, register } from "../Controller/auth.js";


const router = Router();
router.post(
    "/login",
    login
)

router.post("/register", register)

export default router;