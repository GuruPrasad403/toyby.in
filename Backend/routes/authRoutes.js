import express from 'express';
import { Validation } from '../validations/validation.js';
import { UserModel } from '../models/users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT } from '../config/env.js';
import { AdminModel } from '../models/admin.js';
import { authentication } from '../middlewares/authentication.js';
import sendEmail from '../utils/sendEmail.js';
import GenrateOtp from '../utils/genrateOTP.js';

export const authRoutes = express.Router();

authRoutes.get("/", (req, res) => {
    res.json({ msg: "This is from Auth route" });
});

// Signup Route
authRoutes.post("/signup", async (req, res) => {
    const otp = GenrateOtp()
    try {
        // Validate request body
        const validationResponse = Validation.safeParse(req.body);
        if (!validationResponse.success) {
            return res.status(400).json({
                error: validationResponse.error.issues,
                msg: "Incorrect Data",
            });
        }

        const { name, email, password, phone, address, isAdmin } = validationResponse.data;

        // Check if the user already exists
        const checkUserExist = await UserModel.findOne({ email, phone });
        if (checkUserExist) {
            return res.status(409).json({
                redirect: "/signin",
                msg: "User already exists",
            });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Determine if the user is an admin
        if (isAdmin) {
            await AdminModel.create({
                name,
                email,
                password: hashedPassword,
                createdAt: new Date(),
                phone,
                isActive: true,
                lastLogin: new Date(),
                otp,
                address: {
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    postalCode: address.postalCode,
                    country: address.country
                }
            });
            sendEmail(email,"OTP for Verification : Toyby.in", otp)
        } else {
            // Create a new user in the database
            await UserModel.create({
                name,
                email,
                password: hashedPassword,
                createdAt: new Date(),
                phone,
                otp,
                address: {
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    postalCode: address.postalCode,
                    country: address.country
                }
            });
            sendEmail(email,"OTP for Verification : Toyby.in", otp)
        }
        setTimeout(async()=>{
            isAdmin?await AdminModel.findOneAndUpdate({email},{otp:null},{new:true}) :
            await UserModel.findOneAndUpdate({email},{otp:null},{new:true})
        },(1000 * 60  *10))
        res.status(201).json({
            msg: isAdmin ? "Admin successfully created" : "User successfully created",
            verify:"Verfiy Your Account"
        });
    } catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({
            msg: "Server error, please try again later",
        });
    }
});

// Signin Route
authRoutes.post("/signin", async (req, res) => {
    console.log("Request received at /signin route");
    const { email, password, isAdmin } = req.body;
    console.log("Received email:", email);

    // Validate request inputs
    if (!email || !password) {
        return res.status(400).json({ msg: "Email and password are required" });
    }

    try {
        const checkUser = isAdmin
            ? await AdminModel.findOne({ email })
            : await UserModel.findOne({ email });
        console.log("User lookup result:", checkUser);

        if (!checkUser) {
            return res.status(404).json({
                msg: isAdmin ? "Admin not found" : "User not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, checkUser.password);
        console.log("Password valid:", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid password" });
        }

        const jwtToken = jwt.sign({ email }, JWT);
        console.log("JWT token generated:", jwtToken);

        res.status(200).json({
            msg: "Signin successful",
            token: jwtToken
        });
    } catch (error) {
        console.error("Error during user signin:", error);
        res.status(500).json({
            msg: "Server error, please try again later"
        });
    }
});

// User Verification 

authRoutes.put("/verify", async(req,res,next)=>{
    const {otp,email,isAdmin} = req.body;
    const findUser = isAdmin? await AdminModel.findOne({email}) : await UserModel.findOne({email})
    if(parseInt(otp)===parseInt(findUser.otp)){
        isAdmin?await AdminModel.findOneAndUpdate({email}, {isVerified:true},{ new:true}) : await UserModel.findOneAndUpdate({email}, {isVarified:true, new:true})
        res.json(findUser)
        console.log(req.body,typeof(findUser?.otp))

        return 
    }
    res.json({
        msg:"invalid OTP"
    })
})



