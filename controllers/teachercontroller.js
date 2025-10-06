import {
  getavg,
  getuser,
  getlisttable,
  getRankingAbsent,
  getNoLeaveStudents,
  getUserModel,
  getb,
  gets,
  getnotable,
  gettable,
  getsuccess
} from "../models/teacherModel.js";
import { postbs } from "../models/teacherModel.js";

export async function avg(req, res) {
  try {
    const result = await getavg();

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error(`Error Teacher avg`, err);
    return res.status(500).json({ message: "Error Server" });
  }
}

export async function user(req, res) {
  try {
    const result = await getuser();

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error(`Error Teacher user`, err);
    return res.status(500).json({ message: "Error Server" });
  }
}

export async function listtable(req, res) {
  try {
    const { userid } = req.query;
    // console.log(userid);
    if (!userid) {
      console.log(`ไม่พบID`);
    }

    const result = await getlisttable(userid);

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error(`Error Teacher listtable`, err);
    return res.status(500).json({ message: "Error Server" });
  }
}

export async function rankingAbsent(req, res) {
  try {
    const result = await getRankingAbsent();
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error rankingAbsent:", err);
    res.status(500).json({ message: "Error Server" });
  }
}

export async function noLeave(req, res) {
  try {
    const result = await getNoLeaveStudents();
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error noLeave:", err);
    res.status(500).json({ message: "Error Server" });
  }
}

export async function users(req, res) {
  try {
    const result = await getUserModel();
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error noLeave:", err);
    res.status(500).json({ message: "Error Server" });
  }
}

export async function b(req, res) {
  try {
    const result = await getb();

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error b:", err);
    res.status(500).json({ message: "Error Server" });
  }
}

export async function s(req, res) {
  try {
    const result = await gets();

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error b:", err);
    res.status(500).json({ message: "Error Server" });
  }
}

export async function bs(req, res) {
  try {
    const data = req.body;
    console.log(data);

    const result = await postbs(data);
    if (!result.success) {
      return res.status(400).json({ message: "ข้อมูลซ้ำ" });
    }

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error bs", err);
    res.status(500).json({ message: "Error Server" });
  }
}

export async function notable(req, res) {
  try {
    const result = await getnotable();

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error notable", err);
    return res.status(500).json({ message: "Error Server" });
  }
}

export async function table(req, res) {
  try {
    const result = await gettable();

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error table", err);
    return res.status(500).json({ message: "Error Server" });
  }
}

export async function success(req, res) {
  try {
    const result = await getsuccess();

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error success", err);
    return res.status(500).json({ message: "Error Server" });
  }
}
