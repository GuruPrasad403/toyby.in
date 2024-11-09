import { JWT } from "../config/env.js";
import jwt from 'jsonwebtoken';

export const authentication = (req, res, next) => {
    const token = req.headers.authorization;

    // Check if the token is present
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        // Verify the token
        const verify = jwt.verify(token, JWT);
        req.headers.email = verify?.email;
        
        next();  // Continue to the next middleware or route handler
    } catch (e) {
        // Handle specific JWT errors (invalid or expired tokens, etc.)
        if (e.name === 'TokenExpiredError') {
            res.status(401).json({ error: "Token has expired" });
        } else if (e.name === 'JsonWebTokenError') {
            res.status(401).json({ error: "Invalid token" });
        } else {
            // Log unexpected errors for debugging and return a generic error message
            console.error("Authentication error:", e);
            res.status(500).json({ error: "Authentication failed" });
        }
    }
};
