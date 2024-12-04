import { JWT } from "../config/env.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/users.js";

export const authentication = async (req, res, next) => {
    // const authHeader = req.headers.authorization;
    // 
    // // Check if Authorization header exists and starts with "Bearer"
    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //     return res.status(401).json({ error: "No token provided or invalid format" });
    // }

    // // Extract token from the Authorization header
    // const token = authHeader.split(" ")[1];
    try {
        const token = req.headers.authorization
        const {isAdmin} = req.query
    
        // Verify the token
        const decoded = jwt.verify(token, JWT);
        const { email } = decoded;
        if(!isAdmin){
            
        // Find the user by email
        const findUser = await UserModel.findOne({ email });
        if (!findUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Attach user details to the request object for further use
        req.user = {
            email: findUser.email,
            userId: findUser._id,
        };
        }
        req.headers.email= email
        // console.log(req.user)
        // Proceed to the next middleware or route handler
        next();
    } catch (e) {
        // Handle specific JWT errors
        if (e.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token has expired" });
        } else if (e.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }

        // Log unexpected errors for debugging
        console.error("Authentication error:", e);
        return res.status(500).json({ error: "Authentication failed" });
    }
};
