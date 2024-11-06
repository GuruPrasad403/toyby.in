import express from 'express'
import z from 'zod'
import bcyrpt from 'bcrypt'
import {UserModel} from '../models/users.js'
import {userValidation} from '../validations/userValidation.js'
export const authRoutes = express.Router()

authRoutes.post("/signup",async(req,res,next)=>{
    let validationStatus, hashedPassword
    try{
    validationStatus =  userValidation.safeParse(req.body)
    console.log("Validation done ")
    if(!validationStatus.success) return res.json({
        msg:"Invalid Input Data"
    }) 
    hashedPassword = await  bcyrpt.hash(req.body.password,5)
    console.log("Password hashed  ")
    }
    catch (e){
        next(e)
    }
   //posting into the server
   if(validationStatus.success && hashedPassword){
    console.log("Trying to create an data in mongooes")
    try{
        await UserModel.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            createdAt: new Date(),
            isAdmin:req.body.isAdmin,
            isVarified :req.body.isVarified,
            phone:req.body.phone
            })

            res.status(200).json({
                msg:"User Created"
            })
    }
    catch (e){
        next(e)
    }
   }
   

})



