import express from 'express'
import { authentication } from '../middlewares/authentication.js'
export const adminRoutes = express.Router()
import { UserModel } from '../models/users.js'
import verifyAdmin from '../middlewares/verifyAdmin.js'
import { CategoryValidation } from '../validations/categoryValidation.js'
import { CategoryModel } from '../models/catorgey.js'
import slugify from "slugify";
import mongoose from 'mongoose'
import ImageValidation from '../validations/imageValidations.js'
import { ImageModel } from '../models/image.js'
import { BrandValidation } from '../validations/brandValidation.js'
import { BrandModel } from '../models/brand.js'
import CollectionModel from '../models/collections.js'
import { collectionValidation } from '../validations/collectionValidations.js'
const {ObjectId} =  mongoose.Types
//Route is used to view all the users 
adminRoutes.get("/",authentication,verifyAdmin,async(req,res,next)=>{
    const user=await UserModel.find({})
    res.json(user)
})


//adding Catorgey and its discription and it's Images 
adminRoutes.post("/add-category", authentication, verifyAdmin, async (req, res, next) => {
    try {
        // Validate the input using Zod
        const validation = CategoryValidation.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                msg: "Input validation error",
                error: validation.error.errors, // Return detailed validation errors
            });
        }

        const { name, description, image, status, parentCategory } = validation.data;
        const slug = slugify(name, { lower: true, trim: true });
        // Create a new category
        const category = new CategoryModel({
            name,
            description,
            image,
            status,
            slug,
            parentCategory: parentCategory || null, // Null for top-level categories
        });

        // Save the category
        const savedCategory = await category.save();

        res.status(200).json({
            msg: "Category added successfully",
            category: savedCategory,
        });
    } catch (e) {
        console.error("Error while adding the category:", e);
        next(e);
    }
});
//route adding the subCategory  
adminRoutes.post("/add-subcategory", authentication, verifyAdmin, async (req, res, next) => {
    try {
        // Validate the input using Zod schema
        const validation = CategoryValidation.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                msg: "Error in input validation",
                errors: validation.error.errors,
            });
        }

        const { name, description, image, status, parentCategory } = validation.data;
        const slug = slugify(name, { lower: true, trim: true });
        // Ensure parentCategory exists
        const parentCategoryID = new ObjectId(parentCategory)
        // Ensure parentCategory exists
        const parentCategoryExists = await CategoryModel.findById(parentCategoryID);
        if (!parentCategoryExists) {
            return res.status(404).json({ msg: "Parent category not found" });
        }

        // Create the subcategory
        const subCategory = await CategoryModel.create({
            name,
            description,
            image:image|| null,
            status,
            parentCategory,
            slug
        });

        // Update the parent category's subCategories array
        const updatedCategory = await CategoryModel.findByIdAndUpdate(
            parentCategory,
            { $push: { subCategories: subCategory._id } },
            { new: true } // Return the updated document
        );

        res.status(200).json({
            msg: "Subcategory added successfully",
            subCategory,
            updatedCategory,
        });
    } catch (e) {
        console.error("Error while adding subcategory", e);
        next(e);
    }
});
adminRoutes.put("/update-category", authentication, verifyAdmin, async (req, res, next) => {
    try {
        // Validate input using Zod or your validation schema
        const validation = CategoryValidation.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                msg: "Input Validation Failed",
                error: validation.error.errors,
            });
        }

        const { id, name, description, image, status } = req.body;

        // Ensure the ID is provided
        if (!id) {
            return res.status(400).json({ msg: "Category ID is required for updating." });
        }

        // Generate a slug if the name is updated
        const slug = name ? slugify(name, { lower: true, trim: true }) : undefined;

        // Update the category
        const updatedCategory = await CategoryModel.findByIdAndUpdate(
            id, // Find the category by ID
            {
                ...(name && { name }),
                ...(description && { description }),
                ...(image && { image }),
                ...(status !== undefined && { status }), // Allow explicit `false` values
                ...(slug && { slug }), // Update slug only if name changes
            },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedCategory) {
            return res.status(404).json({ msg: "Category not found." });
        }

        res.status(200).json({
            msg: "Category updated successfully.",
            category: updatedCategory,
        });
    } catch (error) {
        console.error("Error while updating category:", error);
        res.status(500).json({
            msg: "Failed to update the category.",
            error: error.message,
        });
    }
});
//get the all the Category

adminRoutes.get("/categories", authentication, async (req, res, next) => {
    try {
        // Fetch all categories and populate subcategories
        const categories = await CategoryModel.find({ parentCategory: null })
            .populate({
                path: "subCategories",
                select: "name slug description status", // Fetch only required fields
            })
            .select("name slug description status subCategories"); // Limit fields returned for parent categories

        res.status(200).json(categories);
    } catch (error) {
        console.error("Error while fetching categories:", error);
        next(error);
    }
});
//route for deleting Category
adminRoutes.delete('/:id', authentication, verifyAdmin, async (req, res, next) => {
    const { id } = req.params;

    try {
        // Step 1: Fetch the category
        const categoryToDelete = await CategoryModel.findById(id).populate('subCategories');

        if (!categoryToDelete) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Step 2: Check if it's a parent category
        if (categoryToDelete.subCategories.length > 0) {
            // It's a parent category, delete all subcategories first
            const subCategoryIds = categoryToDelete.subCategories.map((sub) => sub._id);

            // Delete all subcategories
            await CategoryModel.deleteMany({ _id: { $in: subCategoryIds } });

            // Delete the parent category
            await CategoryModel.findByIdAndDelete(id);

            return res.status(200).json({
                message: "Parent category and its subcategories deleted successfully",
                deletedSubCategories: subCategoryIds,
                deletedParentCategory: id,
            });
        } else {
            // Step 3: Check if it's a subcategory
            const parentCategory = await CategoryModel.findOne({ subCategories: id });

            if (parentCategory) {
                // Remove the subcategory reference from the parent
                parentCategory.subCategories = parentCategory.subCategories.filter(
                    (subId) => subId.toString() !== id
                );
                await parentCategory.save();
            }

            // Delete the subcategory
            await CategoryModel.findByIdAndDelete(id);

            return res.status(200).json({
                message: "Subcategory deleted successfully",
                deletedSubCategory: id,
                updatedParentCategory: parentCategory?._id || null,
            });
        }
    } catch (error) {
        console.error("Error while deleting the category:", error);
        res.status(500).json({
            message: "An error occurred while deleting the category",
            error: error.message,
        });
        next(error);
    }
});

// Add a new image to the banner
adminRoutes.post("/add-image", authentication, verifyAdmin, async (req, res, next) => {
    try {
        // Validate the input using Zod schema
        const validation = ImageValidation.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                msg: "Incorrect Format",
                errors: validation.error.errors,
            });
        }

        // Destructure validated data
        const { title, description, image } = validation.data;

        // Save the image in the database
        const newImage = await ImageModel.create({
            title: title || "Untitled", // Provide a default value
            description: description || "No description provided",
            url:image,
        });

        // Respond with the created image
        res.status(201).json({
            msg: "Image successfully added to the database",
            data: newImage,
        });
    } catch (e) {
        console.error("Error while adding the image to the database: ", e);
        next(e);
    }
});

adminRoutes.put("/image-update", authentication, verifyAdmin, async (req, res, next) => {
    try {
        const { id } = req.body;

        // Check if `id` is provided
        if (!id) {
            return res.status(400).json({
                msg: "Image ID is required for the update",
            });
        }

        // Validate the input data using Zod
        const validate = ImageValidation.safeParse(req.body);
        if (!validate.success) {
            return res.status(400).json({
                msg: "Invalid input data",
                errors: validate.error.errors,
            });
        }

        // Destructure validated data
        const { title, description, image, status } = validate.data;

        // Build the update object dynamically
        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (image) updateData.url = image;
        if (status) updateData.status = status ; // Include status explicitly

        // Update the image record in the database
        const updatedImage = await ImageModel.findByIdAndUpdate(
            id,         // Image ID to update
            updateData, // Fields to update
            { new: true } // Return the updated document
        );

        // Check if the image was updated
        if (!updatedImage) {
            return res.status(404).json({
                msg: "Image not found or could not be updated",
            });
        }

        // Respond with the updated image
        res.status(200).json({
            msg: "Image updated successfully",
            data: updatedImage,
        });
    } catch (e) {
        console.error("Error while updating the blog image:", e);
        next(e); // Pass the error to the global error handler
    }
});

// Creating brands and their images
adminRoutes.post("/add-brand", authentication, verifyAdmin, async (req, res, next) => {
    try {
        const validateImage = ImageValidation.safeParse(req.body.image); // Validate image data
        const validateBrand = BrandValidation.safeParse(req.body.brand); // Validate brand data

        // Handle validation errors
        if (!validateImage.success || !validateBrand.success) {
            return res.status(400).json({
                msg: "Input validation error",
                errors: {
                    imageErrors: validateImage.error?.errors || [],
                    brandErrors: validateBrand.error?.errors || [],
                },
            });
        }

        // Destructure validated data
        const { title, description, image } = validateImage.data;
        const { name, brandDescription } = validateBrand.data;

        // Create image entry
        const createdImage = await ImageModel.create({ title, description, url: image });

        // Create brand entry with the image reference
        const createdBrand = await BrandModel.create({
            imageId: createdImage._id,
            name,
            description: brandDescription,
        });

        res.status(201).json({
            message: "Brand and image successfully created",
            createdBrand,
            createdImage,
        });
    } catch (e) {
        console.error("Error while adding the brand:", e.message);
        next(e); // Pass the error to the error-handling middleware
    }
});

// Getting information about active brands and their images
adminRoutes.get("/brand-info", authentication, verifyAdmin, async (req, res, next) => {
    try {
        // Fetch brands with status "Active" and populate image details
        const brandInfo = await BrandModel.find({ status: "Active" }).populate({
            path: "imageId", // Path to populate the image details
            select: "title url description", // Select only relevant fields from the ImageModel
        });

        res.status(200).json({
            message: "Successfully fetched brand information",
            brands: brandInfo,
        });
    } catch (e) {
        console.error("Error while fetching the brand information:", e.message);
        next(e); // Pass the error to the error-handling middleware
    }
});

// Creation of the New Collections, New Arrivals, and Best Selling Products 
adminRoutes.post("/add-collection", authentication, verifyAdmin, async (req, res, next) => {
    try {
        // Validate the input data
        const validation = collectionValidation.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({
                msg: "Input Validation Error",
                error: validation.error.errors,
            });
        }

        // Destructure the validated data
        const { collectionName, productId } = validation.data;
        const objectproductId =new  mongoose.Types.ObjectId(productId)
        // Create a new collection in the database
        const addedCollection = await CollectionModel.create({
            collectionName,
            productId
        });

        // Respond with the added collection
        res.status(200).json({
            addedCollection
        });
    } catch (e) {
        console.log("Error While Creating the Collection", e);
        next(e);
    }
});

//getting the collection name and there products 
adminRoutes.get("/collection/:collectionName", authentication, verifyAdmin, async (req, res, next) => {
    try {
        const { collectionName } = req.params;
        // Validate the collectionName parameter
        if (!collectionName || typeof collectionName !== "string") {
            return res.status(400).json({
                msg: "Invalid Inputs or Name of the Collections",
            });
        }
        // Query the database using CollectionModel to get the collection data
        const collectedData = await CollectionModel.find({ collectionName }).populate({
            path: "productId", // Populate the related product information
            select: "name title price category discountPercentage thumbnailImageUrls isActive ageRange", // Fields to include
        });

        // Return the collected data as response
        res.status(200).json({
            collectedData,
        });
    } catch (e) {
        console.log("Error While Loading the Collections ", e);
        next(e); // Forward error to the next middleware
    }
});


