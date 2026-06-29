import { Router } from "express";
import { makePayment } from "../Controller/payment.js";


const router = Router();

router.post("/", makePayment);

export default router;