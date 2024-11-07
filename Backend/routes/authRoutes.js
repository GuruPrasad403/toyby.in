import express from 'express'
import { Validation } from '../validations/validation.js';
import { UserModel } from '../models/users.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { JWT } from '../config/env.js';
import { AdminModel } from '../models/admin.js';

export const authRoutes = express.Router();

authRoutes.get("/",(req,res)=>{
    res.json({
        msg:"This is from Auth route"
    })
})
// Signup Route
authRoutes.post("/signup", async (req, res) => {
    // Validate request body
    const validationResponse = Validation.safeParse(req.body);
    if (!validationResponse.success) {
        return res.status(400).json({
            error: validationResponse.error.issues,
            msg: "Incorrect Data",
        });
    }

    const { name, email, password, phone, address, isAdmin } = validationResponse.data;
        
    try {
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
                address:  {
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    postalCode: address.postalCode,
                    country: address.country
                } 
            });
        } else {
            // Create a new user in the database
            await UserModel.create({
                name,
                email,
                password: hashedPassword,
                createdAt: new Date(),
                phone,
                address:{
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    postalCode: address.postalCode,
                    country: address.country
                }
            })
        }

        res.status(201).json({
            msg: req.body.isAdmin? "Admin Not Found" : "User Not Found"
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
    const { email, password } = req.body;
    let checkUser
    req.body.isAdmin?checkUser = await AdminModel.findOne({ email }):checkUser = await UserModel.findOne({ email })
    console.log(checkUser )
    try {
        // Check if the user exists in the database
        
        
        if (!checkUser) {
            return res.status(404).json({
                msg: req.body.isAdmin? "Admin Not Found" : "User Not Found"
            });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, checkUser.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                msg: "Invalid password"
            });
        }

        // Generate JWT token
        const jwtToken = jwt.sign({ email }, JWT);
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
