import { json } from "express";
import {
  getposition,
  getusersession,
  postapply,
  datadate,
  saverow,
  getAttendance,
  getAtt,
  getlist,
  getListApprove,
  updateapr,
  postpname,
  getpo,
  getPositionId,
  updatePnameById,
  delposition,
  getcount,
  getusertable,
  updateRoleById,
  getstudent,
  patchapprove
} from "../models/authModel.js";

// --- Position ---
export async function position(req, res) {
  try {
    const result = await getposition();
    return res.status(200).json({ data: result });
  } catch (err) {
    return res.status(500).json({ message: "Error Server" });
  }
}

// --- Apply ---
export async function apply(req, res) {
  try {
    const data = req.body;
    const result = await postapply(data);
    if (!result.success) {
      return res.status(400).json({ message: "ข้อมูลซ้ำ" });
    }
    return res.status(201).json({ data: result });
  } catch (err) {
    return res.status(500).json({ message: "Error Server" });
  }
}

export async function getuser(req, res) {
  try {
    const dataid = req.session.user.userid;
    const result = await getusersession(dataid);

    return res.status(200).json({ data: result });
  } catch (err) {
    return res.status(500).json({ message: "Error Server" });
  }
}

export async function getdate(req, res) {
  try {
    const userid = req.session.user.userid;
    // console.log(userid);

    const result = await datadate(userid);

    return res.status(200).json({ data: result });
  } catch (err) {
    return res.status(500).json({ message: "Error Server" });
  }
}

export async function saveAttendance(req, res) {
  try {
    const data = req.body;
    if (!data.status) {
      return res.status(400).json({ message: "ไม่พบสถานะ" });
    }

    const result = await saverow(data);
    if (!result.success) {
      return res.status(400).json({ message: "ข้อมูลซ้ำ" });
    }
    return res.status(201).json({ data: result });
  } catch (err) {
    console.error("Error Server", err);
  }
}

export async function fetchAttendance(req, res) {
  try {
    const { userid } = req.query;
    const rows = await getAttendance(userid);
    res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function attendance(req, res) {
  try {
    const userid = req.session.user.userid;
    if (!userid) {
      return res.status(400).json({ message: "ไม่พบข้อมูล" });
    }

    const result = await getAtt(userid);

    return res.status(200).json({ data: result });
  } catch (err) {
    return res.status(500).json({ message: "Error Server" });
  }
}

export async function list(req, res) {
  try {
    const userid = req.session.user.userid;
    if (!userid) {
      return res.status(400).json({ message: "ไม่พบข้อมูล" });
    }

    const result = await getlist(userid);

    return res.status(200).json({ data: result });
  } catch (err) {
    return res.status(500).json({ message: "Error Server" });
  }
}

export async function listApprove(req, res) {
  try {
    const { uid } = req.query;
    console.log("UID ที่ backend ได้รับ:", uid);

    if (!uid) {
      return res.status(400).json({ message: "ไม่พบ uid" });
    }

    const rows = await getListApprove(uid);
    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("Error listApprove:", err);
    return res.status(500).json({ success: false, message: "Error Server" });
  }
}

export async function updateApprove(req, res) {
  try {
    const data = req.body;
    console.log(data);

    if (!data.atid || !data.status) {
      return res.status(400).json({ message: "ไม่พบข้อมูล" });
    }

    const result = await updateapr(data);

    return res.status(200).json({ message: "สำเร็จ" });
  } catch (err) {
    console.error("Error updateApprove:", err);
    return res.status(500).json({ success: false, message: "Error Server" });
  }
}

export async function pname(req, res) {
  try {
    const data = req.body;

    const result = await postpname(data);

    if (!result.success) {
      return res.status(400).json({ message: "สายนี้มีในระบบแล้ว" });
    }

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error(`Error pname`, err);
    return res.status(500).json({ message: "Error Server" });
  }
}

export async function po(req, res) {
  try {
    const result = await getpo();

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error(`Error po`, err);
    return res.status(500).json({ message: "Error Server" });
  }
}

export async function getPositionById(req, res) {
  try {
    const { id } = req.params;
    const result = await getPositionId(id);

    if (!result) {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูล" });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("Error getPositionById:", err);
    return res.status(500).json({ success: false, message: "Error Server" });
  }
}

export async function updatePname(req, res) {
  try {
    const { id } = req.params;
    const { pname } = req.body;

    if (!pname) {
      return res
        .status(400)
        .json({ success: false, message: "กรุณากรอกชื่อสาย" });
    }

    const result = await updatePnameById(id, pname);

    if (!result.success) {
      return res
        .status(400)
        .json({ success: false, message: "แก้ไขไม่สำเร็จ" });
    }

    return res
      .status(200)
      .json({ success: true, message: "แก้ไขเรียบร้อย ✅" });
  } catch (err) {
    console.error("Error updatePname:", err);
    return res.status(500).json({ success: false, message: "Error Server" });
  }
}

export async function del(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "ไม่พบไอดี" });
    }

    const result = await delposition(id);

    return res
      .status(200)
      .json({ success: true, message: "ลบสำเร็จ", data: result });
  } catch (err) {
    console.error("Error del:", err);
    return res.status(500).json({ success: false, message: "Error Server" });
  }
}

export async function count(req, res) {
  try {
    const result = await getcount();

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error count:", err);
    return res.status(500).json({ success: false, message: "Error Server" });
  }
}

export async function usertable(req, res) {
  try {
    const result = await getusertable();

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error count:", err);
    return res.status(500).json({ success: false, message: "Error Server" });
  }
}

export async function updateRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!id || !role) {
      return res.status(400).json({ success: false, message: "ข้อมูลไม่ครบ" });
    }

    const result = await updateRoleById(id, role);

    if (result.success) {
      return res
        .status(200)
        .json({ success: true, message: "อัปเดตบทบาทสำเร็จ" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "ไม่สามารถอัปเดตบทบาทได้" });
    }
  } catch (err) {
    console.error("Error updateRole:", err);
    return res.status(500).json({ success: false, message: "Error Server" });
  }
}

export async function student(req, res) {
  try {
    const id = req.session.user.userid;
   const result = await getstudent(id);

   return res.status(200).json({data : result});
  } catch (err) {
    console.error("Error student:", err);
    return res.status(500).json({ success: false, message: "Error Server" });
  }
}

export async function approveSuccess(req , res) {
  try {
    const data = req.body;
    console.log(data)

    const result = await patchapprove(data);

    return res.status(200).json({message : "อัพเดทสำเร็จ"});
    
  } catch (err) {
    console.error("Error approveSuccess:", err);
    return res.status(500).json({ success: false, message: "Error Server" });
  }
}
