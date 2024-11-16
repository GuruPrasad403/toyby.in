import express from 'express'
import { authentication } from '../middlewares/authentication.js'
import { UserModel } from '../models/users.js'

export const userRoutes = express.Router()
//used to check whether the route is working or not 
userRoutes.get("/",authentication, (req,res,next)=>{
    res.json({
        msg:"This is an UserRoute"
    })
})


//used to view profile 

userRoutes.get("/profile",authentication,async (req,res,next)=>{
    const {email} = req.headers
    try{
        const findUser = await UserModel.findOne({email})
        if(findUser){
            res.status(200).json(findUser)
        }
    }catch(e){
        console.log("Error while finding the user in the db ",e)
        next(e)
    }
})

// used to update the user Data

userRoutes.put("/profile",authentication,async (req,res,next)=>{
    const {email} = req.headers
    try{
        const findUser = await UserModel.findOneAndUpdate({email},req.body,{new:true})
        if(findUser){
            res.status(200).json(findUser)
        }
    }catch(e){
        console.log("Error while Updating the user in the db ",e)
        next(e)
    }
})

