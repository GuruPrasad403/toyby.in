import express from 'express'
import { authentication } from '../middlewares/authentication.js'
import { CartModel } from '../models/cart.js'
import { CartValidationSchema } from '../validations/cartValidation.js'
import mongoose from 'mongoose'
import { ProductModel } from '../models/product.js'
import { UserBindingPage } from 'twilio/lib/rest/chat/v2/service/user/userBinding.js'
export const cartRotues =express.Router()

cartRotues.get("/",authentication,(req,res,next)=>{
    res.json({
        msg:"This is an Cart Route"
    })
})
cartRotues.post("/add", authentication, async (req, res, next) => {
  try {
    const validation = CartValidationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validation.error.errors,
      });
    }
    const {userId} = req.user
    const { items } = validation.data;
    const newItem = items[0]; // Assuming one item is added at a time

    // Convert productID to ObjectId
    newItem.productId = new mongoose.Types.ObjectId(newItem.productId);

    // Check if the cart exists for the user
    let cart = await CartModel.findOne({ userId });

    if (cart) {
      // Ensure cart.items is initialized
      if (!Array.isArray(cart.items)) {
        cart.items = []; // Initialize if not already
      }

      // Check if the product already exists in the cart
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === newItem.productId.toString()
      );

      if (existingItem) {
        return res.status(400).json({
          success: false,
          message: "Product already exists in the cart",
        });
      }

      // Push the new item into the cart's items array
      cart.items.push(newItem);

      // Update the total price
      cart.totalPrice += newItem.price * newItem.quantity;

      // Save the updated cart back to the database
      cart = await cart.save();

      return res.status(200).json({
        success: true,
        message: "Product added to the cart",
        cart,
      });
    } else {
      // If no cart exists, create a new one with validated data
      validation.data.items[0].productId = new mongoose.Types.ObjectId(newItem.productId);
      cart = await CartModel.create(userId,validation.data);

      return res.status(201).json({
        success: true,
        message: "Cart created and product added successfully",
        cart,
      });
    }
  } catch (error) {
    next(error);
  }
});

cartRotues.get("/summary", authentication, async (req, res, next) => {
  try {
    const { email, userId } = req.user;

    // Find the user's cart
    const userCart = await CartModel.findOne({ userId }).populate('items.productId', 'shippingPrice');
    if (!userCart) {
      return res.status(400).json({
        success: false,
        message: "No items in the cart",
      });
    }

    // Calculate total shipping price
    const totalShippingPrice = userCart.items.reduce((acc, item) => {
      const shippingPrice = item.productId?.shippingPrice || 0; // Ensure null safety
      return acc + shippingPrice;
    }, 0);

    // Extract details from the cart
    const totalItems = userCart.items.length;
    const totalPrice = userCart.totalPrice;

    // Optional: Add taxes (e.g., 10% of total price)
    const tax = (totalPrice * 0.1).toFixed(2);

    // Calculate grand total
    const grandTotal = (parseFloat(totalPrice) + totalShippingPrice + parseFloat(tax)).toFixed(2);

    // Send response
    res.status(200).json({
      success: true,
      email,
      userId,
      totalItems,
      totalPrice,
      shippingPrice: totalShippingPrice,
      tax,
      grandTotal,
    });
  } catch (e) {
    console.error("Error while getting summary of the cart:", e.message);
    next(e);
  }
});
cartRotues.delete("/clear", authentication, async (req, res, next) => {
  try {
    const { userId } = req.user;

    // Find and delete the cart for the logged-in user
    const deletedCart = await CartModel.findOneAndDelete({ userId });

    if (!deletedCart) {
      return res.status(404).json({
        msg: "No cart found for the user to delete",
      });
    }

    res.status(200).json({
      msg: "Cart deleted successfully",
      deletedCart,
    });
  } catch (e) {
    console.log("Error while deleting the cart: ", e.message);
    next(e);
  }
});
