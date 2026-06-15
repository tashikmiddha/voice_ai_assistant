import express from "express";
import { getAdminDashboard, deleteUser,updateUser } from "../controllers/admin.controller.js";
import isAdmin from "../middleware/isAdmin.js";

const adminRouter = express.Router();

adminRouter.get("/dashboard", isAdmin, getAdminDashboard);
adminRouter.delete("/user/:userId", isAdmin, deleteUser);
adminRouter.put("/user/:userId", isAdmin, updateUser);

export default adminRouter;