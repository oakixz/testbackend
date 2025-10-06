import { Router } from "express";
import { home } from "../controllers/homecontroller.js";

const router = Router();

router.get("/", home);

export default router;
