import express from "express";
import { getCurrentUser,saveAssistant } from "../controllers/user.controller.js";
const userRouter= express.Router();
import { isAuth } from "../middleware/isAuth.js";
userRouter.get("/current-user",isAuth, getCurrentUser);
userRouter.post("/save-assistant",isAuth, saveAssistant);
export default userRouter;