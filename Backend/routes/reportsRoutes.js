import express from 'express';
import { authentication } from '../middlewares/authentication.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';
import { ProductModel } from '../models/product.js';
import { OrdersModel } from '../models/order.js';
import { UserModel } from '../models/user.js';
import mongoose from 'mongoose';

export const reportRoutes = express.Router();
const { ObjectId } = mongoose.Types;

// Route to get all summary data (revenue, users, products, orders)
reportRoutes.get('/summary', authentication, verifyAdmin, async (req, res, next) => {
    try {
        // Total number of products
        const totalProducts = await ProductModel.countDocuments();

        // Total number of users
        const totalUsers = await UserModel.countDocuments();

        // Total number of orders
        const totalOrders = await OrdersModel.countDocuments();

        // Total revenue (sum of all order amounts)
        const orders = await OrdersModel.aggregate([
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }
            }
        ]);

        const totalRevenue = orders.length > 0 ? orders[0].totalRevenue : 0;

        res.status(200).json({
            totalProducts,
            totalUsers,
            totalOrders,
            totalRevenue
        });
    } catch (error) {
        next(error);
    }
});

// Route to get orders data for the line graph (by date range)
reportRoutes.get('/orders-by-date', authentication, verifyAdmin, async (req, res, next) => {
    const { startDate, endDate } = req.query;

    try {
        const ordersData = await OrdersModel.aggregate([
            {
                $match: {
                    orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
                }
            },
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
                    totalSales: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.status(200).json({
            ordersData
        });
    } catch (error) {
        next(error);
    }
});

// Route to get most sold products with details (image, stock, name, price)
reportRoutes.get('/most-sold-products', authentication, verifyAdmin, async (req, res, next) => {
    try {
        const popularProducts = await OrdersModel.aggregate([
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: "$items.productId",
                    orderCount: { $sum: "$items.quantity" }
                }
            },
            {
                $sort: { orderCount: -1 }
            },
            {
                $limit: 5
            }
        ]);

        const productIds = popularProducts.map(product => product._id);
        const products = await ProductModel.find({
            _id: { $in: productIds }
        }).select('title price stock thumbnail'); // Get product details (name, price, stock, thumbnail)

        const result = popularProducts.map(popProduct => {
            const product = products.find(p => p._id.toString() === popProduct._id.toString());
            return {
                ...product.toObject(),
                orderCount: popProduct.orderCount
            };
        });

        res.status(200).json({
            mostSoldProducts: result
        });
    } catch (error) {
        next(error);
    }
});

export default reportRoutes;
