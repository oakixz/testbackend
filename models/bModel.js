import pool from "../config/pool.js";

export async function getAllAttendance(userid) {
  const [rows] = await pool.query(
    `SELECT *
     FROM attendance a
     JOIN mentor m ON a.userid = m.uid
     WHERE m.bid=?`,
    [userid]
  );
  return rows;
}

export async function getstudents(userid) {
  const [rows] = await pool.query(
    `
    SELECT 
	u.userid,
    u.iduser       AS iduser,
    CONCAT(u.fname, ' ', u.lname) AS fullname,
    a.atwork      AS company,
    a.start   AS start_date,
    a.end     AS end_date,
    SUM(CASE WHEN ad.status = 'present' THEN 1 ELSE 0 END) AS present_count,
    SUM(CASE WHEN ad.status = 'leave'   THEN 1 ELSE 0 END) AS leave_count,
    SUM(CASE WHEN ad.status = 'late'    THEN 1 ELSE 0 END) AS late_count
    FROM user u
    JOIN mentor m     ON u.userid = m.uid
    JOIN apply a      ON u.userid = a.userid
    JOIN attendance ad ON u.userid = ad.userid
    WHERE m.bid = ?
    GROUP BY u.userid, fullname, company, start_date, end_date;`,
    [userid]
  );
  return rows;
}
