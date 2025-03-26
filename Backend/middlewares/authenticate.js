import jwt from 'jsonwebtoken';
import {ApiError} from "../utils/index.js";
import {User} from "../models/user.model.js";


export const authenticateUser = async (req, res, next) => {
    try {
        // Extract token safely using optional chaining
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            console.log("Unauthorized Access Attempt: Missing Token");
            return next(new ApiError(401, "TOKEN_NOT_PROVIDED"));
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            console.error(`Invalid Token Attempt: ${error.message}`);
            return next(new ApiError(401, error.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "INVALID_OR_EXPIRED_TOKEN"));
        }

        if (!decoded?._id) {
            console.warn("Unauthorized Access Attempt: Token Missing User ID");
            return next(new ApiError(401, "UNAUTHORIZED_ACCESS"));
        }

        // Fetch user, excluding sensitive fields
        const user = await User.findById(decoded._id).select("-password -tokens");
        if (!user) {
            console.warn("Unauthorized Access Attempt: User Not Found");
            return next(new ApiError(401, "USER_NOT_FOUND"));
        }

        req.user = user; // Attach user object to the request
        next(); // Move to next middleware
    } catch (error) {
        console.error(`Authentication Middleware Error: ${error.message}`);
        next(new ApiError(500, "INTERNAL_SERVER_ERROR"));
    }
};
