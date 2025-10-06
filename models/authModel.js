import pool from "../config/pool.js";

export async function getposition() {
  const [rows] = await pool.query(`SELECT * FROM position`);
  return rows;
}

export async function getusersession(dataid) {
  const [rows] = await pool.query(
    `SELECT userid , iduser , fname , lname , email FROM user WHERE userid = ?`,
    [dataid]
  );
  return rows;
}

export async function postapply(data) {
  const [rows] = await pool.query(
    `SELECT userid FROM apply WHERE userid = ? `,
    [data.userid]
  );
  if (rows.length > 0) {
    return { success: false, message: "ข้อมูลซ้ำ" };
  }
  const date = new Date();
  const [result] = await pool.query(
    `INSERT INTO apply(userid , positionid , atwork , start , end , create_at)
     VALUES(?,?,?,?,?,?)`,
    [data.userid, data.position, data.work, data.start, data.end, date]
  );
  return {
    success: true,
    id: result.insertId,
    message: "บันทึกข้อมูลการฝึกงานสำเร็จ ✅",
  };
}

export async function datadate(userid) {
  const [rows] = await pool.query(
    `
        SELECT *
        FROM apply a
        JOIN user u ON a.userid = u.userid
        WHERE a.userid = ?`,
    [userid]
  );
  return rows;
}

export async function saverow(data) {
  try {
    const [rows] = await pool.query(
      `SELECT userid , date FROM attendance WHERE userid = ? AND date = ?`,
      [data.userid, data.date]
    );
    if (rows.length > 0) {
      return { success: false, message: "ข้อมูลซ้ำ" };
    }

    const [result] = await pool.query(
      `INSERT INTO attendance(userid , date , status , note , create_at )VALUES(?,?,?,?,now())`,
      [data.userid, data.date, data.status, data.note]
    );

    return { success: true, message: "บันทึกเรียบร้อย" };
  } catch (err) {
    console.error("Error", err);
    throw err;
  }
}

export async function getAttendance(userid) {
  const [rows] = await pool.query(
    "SELECT DATE(date) as date, status, note, approve FROM attendance WHERE userid = ?",
    [userid]
  );
  return rows;
}

export async function getAtt(userid) {
  const [rows] = await pool.query(
    `SELECT date , status , note , create_at ,approve FROM attendance WHERE userid = ? `,
    [userid]
  );

  return rows;
}

export async function getlist(userid) {
  const [rows] = await pool.query(
    `
    SELECT 
    m.mentorid,
    ub.fname AS mentor_fname,
    ub.lname AS mentor_lname,
    m.uid,
    us.fname AS student_fname,
    us.lname AS student_lname,
    p.pname
    
    FROM mentor m
    JOIN user ub ON ub.userid = m.bid
    JOIN user us ON us.userid = m.uid
    JOIN apply ap ON ap.userid = m.uid
    JOIN position p ON p.positionid = ap.positionid
    WHERE m.bid = ?;`,
    [userid]
  );

  return rows;
}

export async function getListApprove(uid) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM attendance a
    JOIN user u ON a.userid = u.userid
    WHERE
    a.userid = ?`,
    [uid]
  );

  return rows;
}

export async function updateapr(data) {
  const [rows] = await pool.query(
    `
    UPDATE attendance SET approve =? WHERE atid = ? `,
    [data.status, data.atid]
  );
  return { success: true, message: "อัพเดทสำเร็จ" };
}

export async function postpname(data) {
  const [rows] = await pool.query(
    `
    SELECT * FROM position WHERE pname = ? `,
    [data.pname]
  );

  if (rows.length > 0) {
    return { success: false, message: "สายนี้มีในระบบแล้ว" };
  }

  const [result] = await pool.query(
    "INSERT INTO `position` (pname, create_at) VALUES (?, ?)",
    [data.pname, new Date()]
  );

  return { success: true, message: "สำเร็จ", result };
}

export async function getpo() {
  const [rows] = await pool.query(`
    SELECT * 
    FROM position`);

  return rows;
}

export async function getPositionId(id) {
  const [rows] = await pool.query(
    "SELECT * FROM `position` WHERE positionid = ?",
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
}

export async function updatePnameById(id, pname) {
  const [result] = await pool.query(
    "UPDATE `position` SET pname = ? WHERE positionid = ?",
    [pname, id]
  );

  return { success: result.affectedRows > 0 };
}

export async function delposition(id) {
  const [result] = await pool.query(
    "DELETE FROM `position` WHERE positionid = ?",
    [id]
  );
  return { success: result.affectedRows > 0 };
}

export async function getcount() {
  const [row1] = await pool.query(
    `SELECT COUNT(*)AS S FROM user WHERE role = 'S' AND active = 'O' AND success = '0'`
  );
  const [row2] = await pool.query(
    `SELECT COUNT(role)AS T FROM user WHERE role = 'T' AND active = 'O'`
  );
  const [row3] = await pool.query(
    `SELECT COUNT(role)AS B FROM user WHERE role = 'B' AND active = 'O'`
  );

  return {
    S: row1[0].S,
    T: row2[0].T,
    B: row3[0].B,
  };
}

export async function getusertable() {
  const [rows] = await pool.query(`SELECT * FROM user `);

  return rows;
}

export async function updateRoleById(userid, role) {
  const [result] = await pool.query(
    "UPDATE user SET role = ? WHERE userid = ?",
    [role, userid]
  );
  return { success: result.affectedRows > 0 };
}

export async function getstudent(id) {
  const [rows] =
    await pool.query(`SELECT u.userid , u.iduser , u.fname , u.lname , u.email ,  u.success
    FROM user u
    JOIN mentor m ON u.userid = m.uid
    where m.bid = ?;`,[id]);
    return rows;
}

export async function patchapprove(data) {
  const [rows] = await pool.query(`UPDATE user SET success = ? WHERE userid = ? `, [data.success , data.userid]);

  return rows;
}