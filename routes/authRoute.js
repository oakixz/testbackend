import express from "express";
import {
  position,
  apply,
  getdate,
  saveAttendance,
  fetchAttendance,
  attendance,
  list,
  listApprove,
  updateApprove,
  pname,
  po,
  getPositionById,
  updatePname,
  del,
  count,
  usertable,
  updateRole,
  student,
  approveSuccess
} from "../controllers/authController.js";

import { viewAttendance, students } from "../controllers/bController.js";

const router = express.Router();

router.get("/getdate", getdate);
router.get("/position", position);
router.get("/attendance", fetchAttendance);
router.get("/getattdance", attendance);
router.get("/list", list);
router.get("/listApprove", listApprove);
router.get("/viewatt", viewAttendance);
router.get("/students", students);
router.get("/position", po);
router.get("/position/:id", getPositionById);
router.get("/count", count);
router.get("/usertable",usertable);
router.get("/student" , student);


router.delete("/del/:id", del);

router.put("/pname/:id", updatePname);
router.put("/updateRole/:id", updateRole);


router.post("/apply", apply);
router.post("/saveAttendance", saveAttendance);
router.post("/updateApprove", updateApprove);
router.post("/pname", pname);

router.patch("/approveSuccess" , approveSuccess);

export default router;
