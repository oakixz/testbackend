import express from "express";

import { register, login, checkSession, logout , countuser ,date } from "../controllers/userController.js";

import {getuser} from "../controllers/authController.js";

const router = express.Router();


router.post("/register", register);
router.get("/check-session", checkSession);
router.get("/countuser",countuser);
router.get("/date",date);


router.post("/login", login);
router.post("/logout", logout);

router.get("/getuser" , getuser);



export default router;