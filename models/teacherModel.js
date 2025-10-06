import pool from "../config/pool.js";

// export async function getavg() {
//   const [rows1] = await pool.query(`
//     SELECT COUNT(*) AS noApplyCount
//     FROM user u
//     WHERE u.role = 'S'
//     AND u.active = 'O'
//     AND NOT EXISTS (
//     SELECT 1 FROM apply ap WHERE ap.userid = u.userid
//   );

//   `);

//   const [rows2] = await pool.query(`
//     SELECT COUNT(userid) AS count2
//     FROM user
//     WHERE role = 'S' AND active = 'O'
//   `);

//   const [rows3] = await pool.query(`
//     SELECT COUNT(userid) AS count3
//     FROM user
//     WHERE success = 1 AND active = 'O'
//   `);

//   return {
//     applyCount: rows1[0].noApplyCount,
//     userCount: rows2[0].count2,
//     success: rows3[0].count3,
//   };
// }

export async function getavg() {
  const [rows1] = await pool.query(`
    SELECT COUNT(*) AS noApplyCount
    FROM user u
    WHERE u.role = 'S' 
      AND u.active = 'O'
      AND NOT EXISTS (
        SELECT 1 FROM apply ap WHERE ap.userid = u.userid
      )
  `);

  const [rows2] = await pool.query(`
    SELECT COUNT(*)as appliedCount  FROM user u JOIN apply a ON u.userid = a.userid WHERE u.role = 'S' AND u.active = 'O' AND u.success = '0'
  `);

  const [rows3] = await pool.query(`
    SELECT COUNT(*)as successCount FROM user u JOIN apply a ON u.userid = a.userid WHERE u.role = 'S' AND u.active = 'O' AND u.success = '1'
  `);

  return {
    noApply: rows1[0].noApplyCount,
    applied: rows2[0].appliedCount,
    success: rows3[0].successCount,
  };
}

export async function getuser() {
  const [rows] = await pool.query(`
    SELECT u.userid,u.iduser, u.fname , u.lname , a.date, a.approve, a.status
    FROM user u
    JOIN attendance a 
    ON u.userid = a.userid
    JOIN (
    SELECT userid, MAX(date) AS max_date
    FROM attendance
    GROUP BY userid
    ) latest 
    ON a.userid = latest.userid AND a.date = latest.max_date
    WHERE u.role = 'S' AND u.active = 'O';

  `);

  return rows;
}

export async function getlisttable(userid) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM attendance a
    JOIN user u ON u.userid = a.userid
    WHERE a.userid = ? 
      AND u.active = 'O'
  `,
    [userid]
  );

  return rows;
}

// export async function getRankingAbsent() {
//   const [rows] = await pool.query(`
//     SELECT
//       u.userid,
//       CONCAT(u.fname, ' ', u.lname) AS fullname,
//       COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS presentCount,
//       COUNT(CASE WHEN a.status = 'leave' THEN 1 END) AS leaveCount,
//       COUNT(CASE WHEN a.status = 'late' THEN 1 END) AS lateCount,
//       COUNT(a.atid) AS totalDays
//     FROM user u
//     LEFT JOIN attendance a ON u.userid = a.userid
//     WHERE u.role = 'S'
//       AND u.active = 'O'
//     GROUP BY u.userid, fullname
//     HAVING presentCount = 0 AND leaveCount = 0 AND lateCount = 0
//   `);

//   return rows;
// }

export async function getRankingAbsent() {
  const [rows] = await pool.query(`
    SELECT 
      u.userid,
      CONCAT(u.fname, ' ', u.lname) AS fullname,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS presentCount,
      COUNT(CASE WHEN a.status = 'leave' THEN 1 END) AS leaveCount,
      COUNT(CASE WHEN a.status = 'late' THEN 1 END) AS lateCount,
      COUNT(a.atid) AS totalDays
    FROM user u
    JOIN apply ap ON u.userid = ap.userid        
    LEFT JOIN attendance a ON u.userid = a.userid
    WHERE u.role = 'S' 
      AND u.active = 'O'
    GROUP BY u.userid, fullname
    HAVING presentCount = 0 
       AND leaveCount = 0 
       AND lateCount = 0
  `);

  return rows;
}

// export async function getNoLeaveStudents() {
//   const [rows] = await pool.query(`
//     SELECT
//       u.userid,
//       CONCAT(u.fname, ' ', u.lname) AS fullname,
//       COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS presentCount,
//       COUNT(CASE WHEN a.status = 'leave' THEN 1 END) AS leaveCount,
//       COUNT(CASE WHEN a.status = 'late' THEN 1 END) AS lateCount,
//       COUNT(a.atid) AS totalDays
//     FROM user u
//     LEFT JOIN attendance a ON u.userid = a.userid
//     WHERE u.role = 'S'
//       AND u.active = 'O'
//     GROUP BY u.userid, fullname
//     HAVING leaveCount = 0
//   `);
//   return rows;
// }

export async function getNoLeaveStudents() {
  const [rows] = await pool.query(`
    SELECT 
      u.userid,
      CONCAT(u.fname, ' ', u.lname) AS fullname,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS presentCount,
      COUNT(CASE WHEN a.status = 'leave' THEN 1 END) AS leaveCount,
      COUNT(CASE WHEN a.status = 'late' THEN 1 END) AS lateCount,
      COUNT(a.atid) AS totalDays
    FROM user u
    JOIN apply ap ON u.userid = ap.userid         
    LEFT JOIN attendance a ON u.userid = a.userid
    WHERE u.role = 'S' 
      AND u.active = 'O'
    GROUP BY u.userid, fullname
    HAVING leaveCount = 0
  `);

  return rows;
}

export async function getUserModel() {
  const [rows] = await pool.query(`
    SELECT  
      u.userid, 
      u.iduser,
      u.fname, 
      u.lname, 
      p.pname,
      ap.atwork,
      ap.start,
      ap.end,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS presentCount,
      COUNT(CASE WHEN a.status = 'leave'   THEN 1 END) AS leaveCount,
      COUNT(CASE WHEN a.status = 'late'    THEN 1 END) AS lateCount
    FROM user u
    LEFT JOIN apply ap ON u.userid = ap.userid
    LEFT JOIN attendance a ON u.userid = a.userid
    JOIN position p ON ap.positionid = p.positionid
    WHERE u.role = 'S' 
      AND u.active = 'O'
    GROUP BY u.userid, u.fname, u.lname, ap.atwork, ap.start, ap.end
  `);

  return rows;
}

export async function getb() {
  const [rows] = await pool.query(
    `SELECT userid , iduser , fname , lname FROM user WHERE role = 'B'`
  );

  return rows;
}

export async function gets(params) {
  const [rows] = await pool.query(
    `SELECT userid , iduser , fname , lname FROM user WHERE role = 'S' `
  );

  return rows;
}

export async function postbs(data) {
  const [rows] = await pool.query(
    `SELECT * FROM mentor WHERE bid = ? AND uid = ?`,
    [data.b, data.S]
  );

  if (rows.length > 0) {
    return { success: false, message: "ข้อมูลซ้ำ" };
  }

  const [result] = await pool.query(
    `INSERT INTO mentor(bid , uid)VALUES(?,?)`,
    [data.b, data.S]
  );

  return { success: true, message: "บันทึกสำเร็จ", result };
}

export async function getnotable() {
  const [rows] = await pool.query(`
    SELECT u.userid , u.iduser , u.fname , u.lname , u.email
    FROM user u
    LEFT JOIN apply a ON u.userid = a.userid
    WHERE a.userid IS NULL 
    AND u.role = 'S';
    `);
  return rows;
}

export async function gettable() {
  const [rows] = await pool.query(`
    SELECT u.userid , u.iduser , u.fname , u.lname , u.email
    FROM user u
    INNER JOIN apply a ON u.userid = a.userid 
    WHERE u.role = 'S'
    AND u.active = 'O';
    `);
  return rows;
}

export async function getsuccess() {
  const [rows] = await pool.query(`
    SELECT u.userid , u.iduser , u.fname , u.lname , u.email
    FROM user u
    INNER JOIN apply a ON u.userid = a.userid 
    WHERE u.role = 'S'
    AND u.active = 'O'
    AND u.success = '1';
    `);
  return rows;
}
