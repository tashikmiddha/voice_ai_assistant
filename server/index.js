import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/auth.route.js";
import cookiesParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import assistantRouter from "./routes/assistant.route.js";
import adminRouter from "./routes/admin.route.js";
dotenv.config();
await connectDB();
const app= express();
const PORT= process.env.PORT ;

app.use(express.json());
// app.use(cors({origin: "http://localhost:5173", credentials: true}));
const privateCors=
cors({origin: "http://localhost:5173",
credentials: true,
});
const publicCors= cors({
    origin: "*",
});

app.use(express.urlencoded({extended: true}));
app.use(cookiesParser());
app.get("/", (req, res)=>{
    res.send("Hello World");
})
app.use("/api/auth", privateCors, authRouter);
app.use("/api/user", privateCors, userRouter);
app.use("/api/assistant", publicCors, assistantRouter);
app.use("/api/admin", privateCors, adminRouter);
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
