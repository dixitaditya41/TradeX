import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Access Denied" });

        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = await User.findById(verified._id).select("-password");
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid Token" });
    }
};

export default authMiddleware;
