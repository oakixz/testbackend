import express from "express";
import { fetchAttendance, fetchStats } from "../controllers/bController.js";

const router = express.Router();

router.get("/", fetchAttendance);
router.get("/stats", fetchStats);

export default router;
