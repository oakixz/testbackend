import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// ✅ Pool = ใช้ connection ซ้ำได้ (ประหยัดกว่าเปิดใหม่ทุกครั้ง)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "mydb",
  port : process.env.DB_PORT || "3306",
  waitForConnections: true,
  connectionLimit: 10,   // จำนวน connection ที่เปิดไว้
  queueLimit: 0
});

try {
  const conn = await pool.getConnection();
  console.log("✅ Database Connected!");
  conn.release();
} catch (err) {
  console.error("❌ Database Connection Error:", err.message);
}

export default pool;
