import express from 'express';
import { authentication } from '../middlewares/authentication.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';
import { ProductModel } from '../models/product.js';
import ProductValidation from '../validations/productValidation.js';
import mongoose from  'mongoose'
// Create a router instance for product routes
export const productRoutes = express.Router();
const {ObjectId} = mongoose.Types
// Basic route for checking if product routes are working
productRoutes.get("/", authentication, (req, res) => {
    res.json({
        msg: "This is a product route"
    });
});

// Route to get all products, accessible only to admins
productRoutes.get("/all", authentication, verifyAdmin, async (req, res, next) => {
    try {
        const productsList = await ProductModel.find({});
        res.json(productsList);
    } catch (error) {
        next(error);
    }
});

// Route to add a new product, accessible only to admins
productRoutes.post("/", authentication, verifyAdmin, async (req, res, next) => {
    const _id = req.headers._id;

    // Validate request body
    const validation = ProductValidation.safeParse(req.body);
    if (!validation.success) {
        // Return a 400 status code and validation errors if validation fails
        return res.status(400).json({
            msg: "Invalid product data",
            errors: validation.error.issues
        });
    }

    // Destructure validated data
    const {
        title, discription, category, price, discountPercentage, imageUrls, stock, brand,
        Wheight, dimensions, warrantyInformation, shippingInformation, returnPolicy,
        minimumOrderQuantity, thumbnailImageUrls, productType, isActive, ageRange,
        material, safetyInformation, tags
    } = validation.data;

    try {
        // Create new product in the database
        const newProduct = await ProductModel.create({
            adminId: _id,
            title, discription, category, price, discountPercentage, imageUrls, stock, brand,
            Wheight, dimensions, warrantyInformation, shippingInformation, returnPolicy,
            minimumOrderQuantity, thumbnailImageUrls, productType, isActive, ageRange,
            material, safetyInformation, tags
        });

        res.status(201).json({
            msg: "Product added successfully",
            product: newProduct
        });
    } catch (error) {
        next(error);
    }
});


productRoutes.put("/:id", authentication, verifyAdmin, async (req, res) => {
    const { id } = req.params; // Get the product ID from the route parameters
    const productData = req.body; // Get the updated product data from the request body
    console.log(id)
    try {
        // Fetch the existing product
        const existingProduct = await ProductModel.findById(id);

        if (!existingProduct) {
            return res.status(404).json({ msg: "Product not found" });
        }

        // Merge the existing product data with the new data from the request body
        const updatedProductData = {
            name: productData.name || existingProduct.name,
            price: productData.price || existingProduct.price,
            description: productData.description || existingProduct.description,
            imageLinks: productData.imageLinks || existingProduct.imageLinks,
            category: productData.category || existingProduct.category,
            stock: productData.stock || existingProduct.stock,
            sku: productData.sku || existingProduct.sku,
            brand: productData.brand || existingProduct.brand,
            weight: productData.weight || existingProduct.weight,
            dimensions: productData.dimensions || existingProduct.dimensions,
            colors: productData.colors || existingProduct.colors,
            material: productData.material || existingProduct.material,
            warranty: productData.warranty || existingProduct.warranty,
            rating: productData.rating || existingProduct.rating,
            reviews: productData.reviews || existingProduct.reviews,
            available: productData.available !== undefined ? productData.available : existingProduct.available, // Boolean check
            lastUpdated: new Date(),
        };

        // Update the product with the new data
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, updatedProductData, { new: true });

        res.json({
            msg: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
});


// Route to get all products, accessible only to admins
productRoutes.get("/:category", authentication, async (req, res, next) => {
    const {category} = req.params; 
    console.log(category)
    try {
        const productsList = await ProductModel.find({category});
        console.log(productsList)
        res.json(productsList);
    } catch (error) {
        next(error);
    }
});
//used to search by the title name 
productRoutes.get("/search/:titleName", async (req, res, next) => {
    const { titleName } = req.params || "Educational";
    console.log("Title search:", titleName); // Log the search term

    try {
        const productsList = await ProductModel.find({
            title: { $regex: titleName, $options: 'i' }
        });
        
        console.log("Query result:", productsList); // Log the query result
        res.json(productsList);
    } catch (error) {
        console.error("Error in /:titleName route:", error);
        next(error);
    }
});


productRoutes.get("/id/:id",authentication, async (req, res, next) => {
    const { id } = req.params;
    console.log("Searching for product with ID:", id);
    
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
    }

    try {
        // Use findById directly with the ID parameter
        const productItem = await ProductModel.findById(id);
        console.log("Product found:", productItem);

        if (productItem) {
            res.status(200).json({
                message: "Product retrieved successfully",
                product: productItem
            });
        } else {
            res.status(404).json({ msg: "Product not found" });
        }
    } catch (e) {
        console.error("Error While Searching Item:", e);
        next(e);
    }
});


