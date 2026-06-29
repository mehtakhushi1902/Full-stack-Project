import { Router } from "express";


import { generateToken } from "../Middelware/authmiddleware";
import { login, register } from "../Controller/auth";


const router = Router();
router.post(
    "/login",
    login
)

router.post("/register", register)

export default router;