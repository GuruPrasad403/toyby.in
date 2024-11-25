import express from 'express';
import { authentication } from '../middlewares/authentication.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';
import { ProductModel } from '../models/product.js';
import { OrdersModel } from '../models/order.js';
import mongoose from 'mongoose';

export const reportRoutes = express.Router();
const { ObjectId } = mongoose.Types;

// Route to get product count and stock status
reportRoutes.get('/product-summary', authentication, verifyAdmin, async (req, res, next) => {
    try {
        // Total number of products
        const totalProducts = await ProductModel.countDocuments();

        // Products in stock and out of stock
        const inStock = await ProductModel.countDocuments({ stock: { $gt: 0 } });
        const outOfStock = await ProductModel.countDocuments({ stock: { $eq: 0 } });

        res.status(200).json({
            totalProducts,
            inStock,
            outOfStock
        });
    } catch (error) {
        next(error);
    }
});

// Route to get order status counts
reportRoutes.get('/order-status-summary', authentication, verifyAdmin, async (req, res, next) => {
    try {
        // Order counts by status
        const pendingOrders = await OrdersModel.countDocuments({ status: 'Pending' });
        const shippedOrders = await OrdersModel.countDocuments({ status: 'Shipped' });
        const deliveredOrders = await OrdersModel.countDocuments({ status: 'Delivered' });
        const cancelledOrders = await OrdersModel.countDocuments({ status: 'Cancelled' });

        res.status(200).json({
            pendingOrders,
            shippedOrders,
            deliveredOrders,
            cancelledOrders
        });
    } catch (error) {
        next(error);
    }
});

// Route to get total sales (order amount)
reportRoutes.get('/sales-summary', authentication, verifyAdmin, async (req, res, next) => {
    try {
        const orders = await OrdersModel.aggregate([
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: "$items.productId",
                    totalSales: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }
            }
        ]);

        const totalSales = orders.reduce((acc, order) => acc + order.totalSales, 0);

        res.status(200).json({
            totalSales
        });
    } catch (error) {
        next(error);
    }
});

// Route to get most popular products (based on order frequency)
reportRoutes.get('/most-popular-products', authentication, verifyAdmin, async (req, res, next) => {
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

        res.status(200).json({
            popularProducts
        });
    } catch (error) {
        next(error);
    }
});

// Route to get orders by date range
reportRoutes.get('/orders-by-date', authentication, verifyAdmin, async (req, res, next) => {
    const { startDate, endDate } = req.query;

    try {
        const ordersByDate = await OrdersModel.find({
            orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });

        res.status(200).json({
            ordersByDate
        });
    } catch (error) { 
        next(error);
    }
});

export default reportRoutes;
