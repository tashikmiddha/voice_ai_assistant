import jwt from "jsonwebtoken";
export const isAuth = (req, res, next) => {
    try {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.userID = verifyToken.userID;
    
    next();
    } catch (error) {
        console.error("Error in isAuth middleware:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};  
export default isAuth;