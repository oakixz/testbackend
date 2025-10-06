import pool from "../config/pool.js";
import bcrypt from "bcrypt";

export async function postregister(data) {
  try {
    const [rows] = await pool.query(
      `SELECT iduser FROM user WHERE iduser = ?`,
      [data.iduser]
    );

    if (rows.length > 0) {
      return { success: false, message: "ข้อมูลซ้ำ" };
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const date = new Date();

    const [result] = await pool.query(
      `INSERT INTO user (iduser, fname , lname , email, password , create_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [data.iduser, data.fname, data.lname, data.email, hashedPassword, date]
    );

    return {
      success: true,
      message: "สมัครสมาชิกสำเร็จ ✅",
      insertId: result.insertId,
    };
  } catch (err) {
    console.error("Error Model", err);
    throw err;
  }
}

export async function findUserById(iduser) {
  const [rows] = await pool.query("SELECT * FROM user WHERE iduser = ?", [
    iduser,
  ]);
  return rows[0];
}

export async function getcountuser(id) {
  const [rows1] = await pool.query(
    `SELECT COUNT(status)AS py FROM attendance WHERE status = 'present' AND approve = 'Y' AND userid = ?;`,
    [id]
  );
  const [rows2] = await pool.query(
    `SELECT COUNT(status)AS pn FROM attendance WHERE status = 'present' AND approve = 'N' AND userid = ?;`,
    [id]
  );
  const [rows3] = await pool.query(
    `SELECT COUNT(status)AS ly FROM attendance WHERE status = 'late' AND approve = 'Y' AND userid = ?;`,
    [id]
  );
  const [rows4] = await pool.query(
    `SELECT COUNT(status)AS ln FROM attendance WHERE status = 'late' AND approve = 'N' AND userid = ?;`,
    [id]
  );
  const [rows5] = await pool.query(
    `SELECT COUNT(status)AS ey FROM attendance WHERE status = 'leave' AND approve = 'Y' AND userid = ?;`,
    [id]
  );
  const [rows6] = await pool.query(
    `SELECT COUNT(status)AS en FROM attendance WHERE status = 'leave' AND approve = 'N' AND userid = ?;`,
    [id]
  );

  return {
    py: rows1[0].py,
    pn: rows2[0].pn,
    ly: rows3[0].ly,
    ln: rows4[0].ln,
    ey: rows5[0].ey,
    en: rows6[0].en,
  };
}

export async function getdatee(id) {
  const [rows] = await pool.query(
    `SELECT start , end FROM apply WHERE userid = ?`,
    [id]
  );
  return rows;
}
