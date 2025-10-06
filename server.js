import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";


import indexRoutes from "./routes/index.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import teacherRoute from "./routes/teacherRoute.js";

dotenv.config();
const port = process.env.PORT || 3000;

const local = process.env.LOCAL || "http://localhost";



const app = express();

app.use(cors({
  origin: [`${local}`],
  credentials: true
}));


app.use(session({
  secret: process.env.SESSION_SECRET || "mysecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // ถ้าใช้ HTTPS ต้องเปลี่ยนเป็น true
    httpOnly: true,
    maxAge: 1000 * 60 * 60 // 1 ชั่วโมง
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/", indexRoutes);

app.use("/api/auth",authRoute);
app.use("/api/user",userRoute);
app.use("/api/teacher" , teacherRoute);



app.listen(port, () => {
  console.log(`🚀 Server running at ${local}}`);
});
