import express from 'express'
import { authentication } from '../middlewares/authentication.js'
import verifyAdmin from '../middlewares/verifyAdmin.js'
import {OrdersModel} from "../models/order.js"
import { UserModel } from '../models/users.js'
import mongoose from 'mongoose'
import {orderSchema, StatusValidation} from '../validations/orderValidation.js'
import { ProductModel } from '../models/product.js'
import { downloadCSV } from '../utils/downloadcsv.js';
import { upload, validateCSVHeaders, convertToJson } from '../utils/fileStorage.js';
import {updateFromCSV,preprocessData} from '../utils/updateBulk.js'
export const orderRoute = express.Router()
import fs from 'fs'
const {ObjectId} = mongoose.Types
orderRoute.get("/",authentication,(req,res,next)=>{
    res.status(200).json({
        msg:"this is from order Route"
    })
})
orderRoute.post("/createorder", authentication, async (req, res, next) => {
    const { id } = req.user; // User ID from authentication middleware
    const email = req.headers.email;

    try {
        // Validate request body
        const validation = orderSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json(validation.error);
        }

        console.log("Creating/updating order for:", id, email);

        const { items, status, deliveryDate } = validation.data;

        // Find user by email
        const findUser = await UserModel.findOne({ email });

        if (!findUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Check if an order already exists for the user
        const existingOrder = await OrdersModel.findOne({ user: findUser._id });

        if (existingOrder) {
            // If order exists, iterate over the new items
            items.forEach((newItem) => {
                const existingItem = existingOrder.items.find(
                    (item) => item.productId.toString() === newItem.productId.toString()
                );

                if (existingItem) {
                    // Update quantity and price for existing product
                    existingItem.quantity += newItem.quantity;
                    existingItem.price += newItem.price;
                } else {
                    // Add new product to items array
                    existingOrder.items.push(newItem);
                }
            });

            if (status) existingOrder.status = status; // Optionally update status
            if (deliveryDate) existingOrder.deliveryDate = deliveryDate; // Optionally update delivery date
            await existingOrder.save();

            console.log("Order updated successfully:", existingOrder);
            return res.status(200).json({ msg: "Order updated successfully", order: existingOrder });
        } else {
            // If no order exists, create a new one
            const newOrder = await OrdersModel.create({
                user: findUser._id,
                items,
                status,
                deliveryDate,
            });

            console.log("Order created successfully:", newOrder);
            return res.status(201).json({ msg: "Order created successfully", order: newOrder });
        }
    } catch (error) {
        console.error("Error while creating/updating order:", error);
        next(error);
    }
});

//fetch each user Orders 

orderRoute.get("/search/:id",authentication, async(req,res,next)=>{
    const {id} = req.params;
    const {userId} = req.user
    try{
    const orders = await OrdersModel.find({user: new ObjectId(userId)});
    res.status(200).json({orders});
    }
    catch (e){
        console.log("error While getting the all orders ", e)
        next(e)
    }
})
orderRoute.get("/searchall", authentication, verifyAdmin, async (req, res, next) => {
    try {
        // Fetch all orders
        const orders = await OrdersModel.find({});

        // Process each order to replace productId with product details
        const orderDetails = await Promise.all(
            orders.map(async (order) => {
                // Replace productId in each item with the corresponding product details
                const updatedItems = await Promise.all(
                    order.items.map(async (item) => {
                        const product = await ProductModel.findById(item.productId);
                        if (product) {
                            return {
                                ...item.toObject(), // Copy existing item details
                                product, // Add the full product details
                            };
                        }
                        return item; // If product not found, return item as is
                    })
                );

                return {
                    ...order.toObject(), // Convert MongoDB order document to plain object
                    items: updatedItems, // Replace items with updated items
                };
            })
        );

        res.status(200).json(orderDetails);
    } catch (e) {
        console.log("Error While Searching all the Orders", e);
        next(e);
    }
});

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



// ********************************************* Bulck Order Modification ********************************** 
orderRoute.get('/csv', async (req, res, next) => {
    try {
        // Fetch all orders with populated product and user details
        const orders = await OrdersModel.find({})
            .populate('items.productId', 'title price _id sku')  // Populate product details with SKU
            .populate('user', 'name email phone address')  // Populate user details

        console.log('Fetched Orders:', JSON.stringify(orders, null, 2));

        // Check if orders exist
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found.' });
        }

        // Transform orders into a flat structure and include useful extra data
        const orderData = orders.flatMap(order =>
            (order.items || []).map(item => ({
                orderId: order._id,
                customerName: order.user?.name || 'Unknown User',
                customerEmail: order.user?.email || 'Unknown Email',
                customerPhone: order.user?.phone || 'Unknown Phone',
                shippingAddress: `${order.user?.address?.street || 'N/A'}, ${order.user?.address?.city || 'N/A'}, ${order.user?.address?.state || 'N/A'}, ${order.user?.address?.postalCode || 'N/A'}, ${order.user?.address?.country || 'N/A'}`,
                productId: item?.productId?._id || 'N/A',
                productName: item?.productId?.title || 'Unknown',
                productPrice: item?.productId?.price || 0,
                productSku: item?.productId?.sku || 'N/A',  // Add SKU of product
                quantity: item?.quantity || 0,
                packingCharges: item?.packingCharges || 0,
                orderStatus: order.status || 'Pending',  // Add order status
                createdAt: order.createdAt || 'N/A',  // Order creation date
                deliverDate: order.deliverDate || 'N/A',  // Delivery date
                totalOrderValue: item?.quantity * (item?.productId?.price || 0),  // Total product price
                discount: order.discount || 0,  // Add discount if exists
                paymentMethod: order.paymentMethod || 'N/A',  // Add payment method
                shippingCost: order.shippingCost || 0,  // Add shipping cost
                paymentStatus: order.paymentStatus || 'Unpaid',  // Payment status
                trackingNumber: order.trackingNumber || 'N/A',  // Add tracking number
                notes: order.notes || 'N/A',  // Special instructions if any
                referralSource: order.referralSource || 'N/A'  // Referral source for the order
            }))
        );

        console.log('Transformed Order Data:', orderData);

        // Mock a model object to match the downloadCSV requirements
        const mockModel = {
            find: async () => orderData,
        };

        // Generate and send the CSV file
        await downloadCSV(mockModel, res);
    } catch (error) {
        console.error('Error generating order CSV:', error);
        res.status(500).json({ message: 'Error generating order CSV file.', error: error.message });
    }
});


// Route to upload CSV for updating orders
orderRoute.post('/bp/update', upload.single('csv'), async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // Get file path in /tmp
    const filePath = `/tmp/${req.file.filename}`;

    // Validate CSV headers
    const requiredFields = ['orderId', 'productId', 'productPrice', 'quantity', 'orderStatus', 'createdAt', 'deliverDate', 'totalOrderValue'];
    const { missingFields, extraFields } = await validateCSVHeaders(filePath, requiredFields);

    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    if (extraFields.length > 0) {
      return res.status(400).json({ message: `Extra fields found: ${extraFields.join(', ')}` });
    }

    // Convert CSV to JSON
    const csvData = await convertToJson(filePath);

    // Preprocess and normalize data
    const updatedData = preprocessData(csvData);

    // Perform bulk update operation
    await updateFromCSV(filePath, OrdersModel);

    // Cleanup temporary file
    fs.unlinkSync(filePath);

    // Respond with success
    res.status(200).json({ message: 'Orders updated successfully.' });
  } catch (error) {
    console.error('Error uploading CSV:', error);

    // If file exists, delete it to avoid leftover temp files
    if (req.file && fs.existsSync(`/tmp/${req.file.filename}`)) {
      fs.unlinkSync(`/tmp/${req.file.filename}`);
    }

    res.status(500).json({ message: 'Error uploading CSV file.', error: error.message });
  }
});
