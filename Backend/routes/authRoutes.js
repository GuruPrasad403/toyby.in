import express from 'express';
import { Validation } from '../validations/validation.js';
import { UserModel } from '../models/users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT } from '../config/env.js';
import { AdminModel } from '../models/admin.js';
import sendEmail from '../utils/sendEmail.js';
import GenrateOtp from '../utils/genrateOTP.js';
import { sendOTP } from '../utils/sendOTP&VerifyOTP.js';

export const authRoutes = express.Router();

// Default route
authRoutes.get("/", (req, res) => {
    res.json({ msg: "This is from Auth route" });
});

// Signup Route
authRoutes.post("/signup", async (req, res) => {
    const otp = GenrateOtp(); // Generate OTP
    const hashedOtp = await bcrypt.hash(otp, 10); // Hash OTP

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

        if (isAdmin) {
            await AdminModel.create({
                name,
                email,
                password: hashedPassword,
                createdAt: new Date(),
                phone,
                isActive: true,
                lastLogin: new Date(),
                otp: hashedOtp, // Save hashed OTP
                address: {
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    postalCode: address.postalCode,
                    country: address.country,
                },
            });
            sendEmail(email, "OTP for Verification: Toyby.in", otp);
            sendOTP(`${phone}`, `Dear ${name}, your OTP for Toyby.in is ${otp}. This code is valid for 10 minutes. Please do not share it with anyone.`);
        } else {
            await UserModel.create({
                name,
                email,
                password: hashedPassword,
                createdAt: new Date(),
                phone,
                otp: hashedOtp, // Save hashed OTP
                address: {
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    postalCode: address.postalCode,
                    country: address.country,
                },
            });
            sendEmail(email, "OTP for Verification: Toyby.in", otp);
            sendOTP(`${phone}`, `Dear ${name}, your OTP for Toyby.in is ${otp}. This code is valid for 10 minutes. Please do not share it with anyone.`);
        }

        // Automatically clear OTP after 10 minutes
        setTimeout(async () => {
            const updateFields = { otp: null };
            isAdmin
                ? await AdminModel.findOneAndUpdate({ email }, updateFields, { new: true })
                : await UserModel.findOneAndUpdate({ email }, updateFields, { new: true });
        }, 1000 * 60 * 10);

        res.status(201).json({
            msg: isAdmin ? "Admin successfully created" : "User successfully created",
            verify: "Verify Your Account",
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
    const { email, password, isAdmin } = req.body;

    // Validate request inputs
    if (!email || !password) {
        return res.status(400).json({ msg: "Email and password are required" });
    }

    try {
        const checkUser = isAdmin
            ? await AdminModel.findOne({ email })
            : await UserModel.findOne({ email });

        if (!checkUser) {
            return res.status(404).json({
                msg: isAdmin ? "Admin not found" : "User not found",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, checkUser.password);

        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid password" });
        }

        const jwtToken = jwt.sign({ email }, JWT);

        res.status(200).json({
            msg: "Signin successful",
            token: jwtToken,
        });
    } catch (error) {
        console.error("Error during user signin:", error);
        res.status(500).json({
            msg: "Server error, please try again later",
        });
    }
});

// User Verification Route
authRoutes.put("/verify", async (req, res) => {
    const { otp, email, isAdmin } = req.body;

    try {
        // Find user by email
        const findUser = isAdmin
            ? await AdminModel.findOne({ email })
            : await UserModel.findOne({ email });

        if (!findUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Compare the provided OTP with the hashed OTP
        const isOtpValid = await bcrypt.compare(otp, findUser.otp);
        if (isOtpValid) {
            const updateFields = { isVerified: true, otp: null }; // Clear OTP on success
            const updatedUser = isAdmin
                ? await AdminModel.findOneAndUpdate({ email }, updateFields, { new: true })
                : await UserModel.findOneAndUpdate({ email }, updateFields, { new: true });

            return res.status(200).json({
                msg: "Verification successful",
                user: updatedUser,
            });
        }

        return res.status(400).json({ msg: "Invalid OTP" });
    } catch (error) {
        console.error("Error during OTP verification:", error);
        res.status(500).json({ msg: "Server error, please try again later" });
    }
});
