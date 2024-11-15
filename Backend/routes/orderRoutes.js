import express from 'express'
import { authentication } from '../middlewares/authentication.js'
import verifyAdmin from '../middlewares/verifyAdmin.js'
import {OrdersModel} from "../models/order.js"
import { UserModel } from '../models/users.js'
import mongoose from 'mongoose'
import {orderSchema, StatusValidation} from '../validations/orderValidation.js'
export const orderRoute = express.Router()
const {ObjectId} = mongoose.Types
orderRoute.get("/",authentication,(req,res,next)=>{
    res.status(200).json({
        msg:"this is from order Route"
    })
})

orderRoute.post("/createorder/:id", authentication, async (req, res, next) => {
    const { id } = req.params;
    const email = req.headers.email;
    

    
    try {
        const Validation = orderSchema.safeParse(req.body)
        if(Validation.success===false)
            res.status(401).json(Validation.error)
        else {
        console.log("Creating order for:", id, email);
        console.log(Validation)
        const { items, status, deliveryDate } = Validation.data;
        
        // Find user by email
        const findUser = await UserModel.findOne({ email });

        if (!findUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Create the order
        const orderCreated = await OrdersModel.create({
            user: findUser._id,
            items,
            status,
            deliveryDate
        });

        console.log("Order created successfully:", orderCreated);
        res.status(201).json({ msg: "Order created successfully", order: orderCreated });
    }
    } catch (error) {
        console.error("Error while creating order:", error);
        next(error);
    }
});

//fetch each user Orders 

orderRoute.get("/search/:id",authentication, async(req,res,next)=>{
    const {id} = req.params;
    try{
    const orders = await OrdersModel.find({user: new ObjectId(id)});
    res.status(200).json({orders});
    }
    catch (e){
        console.log("error While getting the all orders ", e)
        next(e)
    }
})

//get all the orders 
orderRoute.get("/search",authentication,verifyAdmin,async (req,res,next)=>{
    try{
        const Orders = await OrdersModel.find({})
        res.status(200).json(Orders)
    }
    catch(e){
        console.log("Error While Searching all the Orders ",e)
        next(e)
    }
})

// get orders by status 
orderRoute.get("/status/:status", authentication, verifyAdmin, async (req, res, next) => {
    const { status } = req.params;

    // Check if the status is valid
    if (!['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
        return res.status(400).json({ msg: "Invalid order status" });
    }

    console.log("Searching for orders with status:", status);  // Log the status being searched

    try {
        // Use case-insensitive regex to find orders with matching status
        const orderStatus = await OrdersModel.find({
            status: { $regex: status, $options: 'i' }  // Makes the search case-insensitive
        });

        if (orderStatus.length > 0) {
            res.status(200).json(orderStatus);
        } else {
            res.status(404).json({ msg: "No orders found with the given status" });
        }
    } catch (e) {
        console.error("Error while getting the status of the order:", e);
        next(e);
    }
});


//update order Satus 
orderRoute.put("/update/:id", authentication, verifyAdmin, async (req, res, next) => {
    const { id } = req.params;  // Get the order ID from URL params
    const { status } = req.body; // Get the new status from the request body

    
    try {
        const validation = StatusValidation.safeParse(status)
        console.log(validation)
        if(!validation.success){
            res.json({
            msg:`Please Send The Status of The Order and Id : ${id}`
            })
        return
            }
        // Update only the status of the order with the provided ID
        const updatedOrder = await OrdersModel.findByIdAndUpdate(
            id,                  // Directly pass the order ID
            { status: status },   // Only update the status field
            { new: true }         // Return the updated document, not the original
        );

        if (!updatedOrder) {
            // Handle case where no order was found with the given ID
            return res.status(404).json({ message: "Order not found" });
        }

        // Return the updated order
        res.status(200).json(updatedOrder);
    } catch (e) {
        console.log("Error While Updating Status of an Order", e);
        next(e); // Pass the error to the error handling middleware
    }
});

