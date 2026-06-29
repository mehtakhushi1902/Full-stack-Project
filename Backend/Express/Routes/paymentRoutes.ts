import { Router } from "express";
import { makePayment } from "../Controller/payment.ts";


const router = Router();

router.post("/", makePayment);

export default router;