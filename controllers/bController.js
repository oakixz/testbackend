import { getAllAttendance ,getstudents} from "../models/bModel.js";


export async function viewAttendance(req, res) {
  try {
    const userid = req.session.user.userid;
    const data = await getAllAttendance(userid);
    res.json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.error("Error viewAttendance:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export async function students(req, res) {
  try {
    const userid = req.session.user.userid;
    const data = await getstudents(userid);
    res.json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.error("Error students:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}



