import express from 'express';
import { authentication } from '../middlewares/authentication.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';
import { ProductModel } from '../models/product.js';
import ProductValidation from '../validations/productValidation.js';
import mongoose from  'mongoose'
import { downloadCSV } from '../utils/downloadcsv.js';
import { convertToJson, upload,validateCSVHeaders,preprocessData } from '../utils/fileStorage.js';
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





//  **************************************** Bulck Modification Routes ***********************************************************

productRoutes.get("/bp/:query",/*authentication,verifyAdmin*/ async (req, res, next) => {
    // example: http://localhost:3000/api/products/bp/category-Toys-price-59.99
    const { query } = req.params;
    const searchFilter = {};
  
    // Convert the query string into a search filter object
  if(query){
    const queryParts = query.split("-"); // Example: "category-Toys-price-50"
  
    for (let i = 0; i < queryParts.length; i += 2) {
      const key = queryParts[i]; // Example: "category"
      const value = queryParts[i + 1]; // Example: "Toys"
      if (key && value) {
        searchFilter[key] = value;
      }
    }
  }
    try {
      // Call the downloadCSV function with the constructed filter
      await downloadCSV(ProductModel, res, searchFilter);
    } catch (error) {
      console.log("Error in Bp/all", error);
      res.status(500).json({ message: "Error generating CSV file" });
    }
  });
productRoutes.post('/bp/update', upload.single('csv'), async (req, res, next) => {
    try {
        const requiredFields = [
            '_id',
            'title',
            'description',
            'category',
            'price',
            'discountPercentage',
            'rating',
            'imageUrls',
            'stock',
            'brand',
            'Wheight',
            'dimensions',
            'warrantyInformation',
            'shippingInformation',
            'returnPolicy',
            'minimumOrderQuantity',
            'thumbnailImageUrls',
            'productType',
            'isActive',
            'ageRange',
            'material',
            'safetyInformation',
            'tags',
            '__v',
          ];
          
      // Validate file exists
      if (!req.file) {
        return res.status(400).json({ error: { message: 'No file uploaded' } });
      }
  
      const filePath = req.file.path;
  
      // Validate the CSV headers
      const { missingFields, extraFields } = await validateCSVHeaders(filePath, requiredFields);
  
      if (missingFields.length > 0 || extraFields.length > 0) {
        return res.status(400).json({
          error: {
            message: 'Invalid CSV format',
            missingFields,
            extraFields,
          },
        });
      }
  
      // Convert CSV to JSON
      let jsonData = await convertToJson(filePath);
  
      // Preprocess data
      jsonData = preprocessData(jsonData);
  
      // Update records in MongoDB
      const bulkOps = jsonData.map((record) => ({
        updateOne: {
          filter: { _id: record._id },
          update: record,
          upsert: false, // Ensure no new records are created
        },
      }));
  
      const result = await ProductModel.bulkWrite(bulkOps);
  
      res.status(200).json({
        message: 'Products updated successfully',
        result,
      });
    } catch (e) {
      console.error('Error while processing the file', e);
      next(e);
    }
  });

//Bulk Adding 
productRoutes.post("/bp/add", upload.single('csv'), async (req, res, next) => {
    try {
        // Validate that a file is uploaded
        if (!req.file) {
            return res.status(400).json({ error: { message: 'No file uploaded' } });
        }

        // Convert CSV to JSON
        const jsonData = await convertToJson(req.file.path); // Await the async function

        // If needed, preprocess the JSON data
        const processedData = preprocessData(jsonData);

        // Add the products to the database
        const result = await ProductModel.insertMany(processedData);

        res.status(200).json({
            message: 'Products added successfully',
            insertedCount: result.length,
            products: result
        });
    } catch (e) {
        console.error("Error while adding products: ", e);
        next(e);
    }
});
