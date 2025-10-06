import bcrypt from "bcrypt";
import { postregister, findUserById , getcountuser , getdatee} from "../models/userModel.js";
import { getdate } from "./authController.js";

export async function register(req, res) {
  try {
    const data = req.body;
    // console.log(data);
    if (!data) {
      return res.status(400).json({ message: "ไม่พบข้อมูล" });
    }

    const result = await postregister(data);
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Error Server" });
  }
}

export async function login(req, res) {
  try {
    const { iduser, password } = req.body;

    // หา user จาก DB
    const user = await findUserById(iduser);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "ไม่พบผู้ใช้ ❌" });
    }

    // ตรวจสอบ password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "รหัสผ่านไม่ถูกต้อง ❌" });
    }

    // เก็บ session
    req.session.user = {
      userid: user.userid, // 👈 ต้องเก็บ PK ตัวนี้
      iduser: user.iduser, // รหัสนิสิต (string)
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      role: user.role,
    };

    return res.status(200).json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ ✅",
      user: req.session.user,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const checkSession = (req, res) => {
  if (req.session.user) {
    return res.json({ loggedIn: true, user: req.session.user });
  }
  return res.json({ loggedIn: false });
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // ลบ cookie
    return res.json({ success: true, message: "ออกจากระบบแล้ว ✅" });
  });
};


export async function countuser(req , res) {
  try
  {
    const id = req.session.user.userid;
    const result = await getcountuser(id);

    return res.status(200).json({ success: true, data: result });
  }
  catch(err)
  {
    console.error("Error countuser",err);
    return res.status(500).json({message : "Error Server"});
  }
}


export async function date(req , res) {
  try
  {
    const id = req.session.user.userid;
    const result = await getdatee(id);

    return res.status(200).json({ success: true, data: result });
  }
  catch(err)
  {
    console.error("Error countuser",err);
    return res.status(500).json({message : "Error Server"});
  }
}



