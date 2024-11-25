import express from 'express'
import { authentication } from '../middlewares/authentication.js'
export const adminRoutes = express.Router()
import { UserModel } from '../models/users.js'
import verifyAdmin from '../middlewares/verifyAdmin.js'


//Route is used to view all the u sers 
adminRoutes.get("/",authentication,verifyAdmin,async(req,res,next)=>{
    const user=await UserModel.find({})
    res.json(user)
})


