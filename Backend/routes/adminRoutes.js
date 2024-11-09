import express from 'express'
import { authentication } from '../middlewares/authentication.js'
export const adminRoutes = express.Router()
import { UserModel } from '../models/users.js'
adminRoutes.get("/",authentication,async(req,res,next)=>{
    
    const user=await UserModel.find({})
    res.json(user)
})



