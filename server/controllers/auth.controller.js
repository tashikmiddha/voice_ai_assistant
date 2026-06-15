import User from "../models/user.model.js";

import { genToken } from "../config/token.js";


export const googleAuth = async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email || !name) {
            return res.status(400).json({ message: "Email and name are required" });
        }
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ email, name });
        }
        const token = await genToken(user._id,user.isAdmin);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });
        return res.status(200).json( user );
    } catch (error) {
        console.error("Error in Google Auth:", error);
        return res.status(500).json({ message: "google auth failed" });
    }
};


export const logOut=async (req, res)=>{
    try {
        await res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in Logout:", error);
        return res.status(500).json({ message: "Logout failed" });
    }
};