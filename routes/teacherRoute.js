import express from "express";

import {avg ,user , listtable , rankingAbsent , noLeave , users , b , s , notable , table , success} from "../controllers/teachercontroller.js";
import {bs} from "../controllers/teachercontroller.js";
const router = express.Router();

router.get(`/avg`,avg);
router.get(`/user`,user);
router.get("/listtable",listtable);
router.get("/rankingAbsent",rankingAbsent);
router.get("/noLeave",noLeave);
router.get("/users",users);
router.get("/b",b);
router.get("/s",s);
router.get("/notable",notable);
router.get("/table",table);
router.get("/success",success);


router.post("/bs",bs);


export default router;