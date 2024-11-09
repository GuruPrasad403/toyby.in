import { AdminModel } from "../models/admin.js";

export default async function verifyAdmin(req, res, next) {
    try {
        const adminEmail = req.headers.email;
        console.log("Admin email from headers:", adminEmail);

        // Retrieve admin details based on email
        const adminDetails = await AdminModel.findOne({ email: adminEmail });
        console.log("Admin details:", adminDetails?._id);

        // Check if adminDetails exist and if isAdmin is true
        if (adminDetails && adminDetails.isAdmin) {
            req.headers._id= adminDetails._id
            next(); // Proceed to the next middleware or route handler
        } else {
            res.status(403).json({ msg: "You are not authorized as an admin." });
        }
    } catch (error) {
        console.error("Error verifying admin:", error);
        res.status(500).json({ msg: "Server error." });
    }
}
