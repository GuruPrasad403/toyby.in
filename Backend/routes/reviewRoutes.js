import express from 'express'
import { authentication } from '../middlewares/authentication.js'
import { reviewValidationSchema,reviewUpdateValidation } from '../validations/reviewValidation.js'
import { ReviewModel } from '../models/reviews.js'
import mongoose from 'mongoose'
import { UserModel } from '../models/users.js'

export const reviewRoutes = express.Router()

reviewRoutes.get("/", authentication,async(req,res,next)=>{
    res.json({
        msg:"This is Review Routes "
    })
})


reviewRoutes.post('/add', authentication, async (req, res, next) => {
  try {
    const { ObjectId } = mongoose.Types;

    // Validate request body using Zod schema
    const validation = reviewValidationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        msg: "Invalid Inputs",
        error: validation.error.issues,
      });
    }

    // Extract validated data
    const { productId, title, description, rating } = validation.data.review[0];
    const { userId } = req.user;

    // Check if the user already exists in the database
    let userReview = await ReviewModel.findOne({ userId });

    // If the user does not exist, create the user and add the first review
    if (!userReview) {
      userReview = await ReviewModel.create({
        userId,
        review: [{ productId, title, description, rating }], // Use `review` as per your schema
      });
      return res.status(201).json({
        msg: "User and review created successfully",
        review: userReview,
      });
    }

    // Ensure the review field exists (initialize it if necessary)
    if (!userReview.review) {
      userReview.review = [];
    }

    // Check if the user has already reviewed the product
    const productAlreadyReviewed = userReview.review.some(
      (review) => review.productId.toString() === productId
    );

    if (productAlreadyReviewed) {
      return res.status(400).json({
        msg: "You have already reviewed this product",
      });
    }

    // Add the new review to the user's review array
    userReview.review.push({ productId, title, description, rating });

    // Save the user document with the updated review array
    await userReview.save();

    res.status(200).json({
      msg: "Review added successfully",
      review: userReview,
    });
  } catch (e) {
    console.error("Error while adding review:", e);
    res.status(500).json({ msg: "Internal server error", error: e.message });
  }
});
reviewRoutes.put("/update", authentication, async (req, res, next) => {
  try{const { userId } = req.user;
 // Validate request body using Zod schema
 const validation = reviewUpdateValidation.safeParse(req.body);
 if (!validation.success) {
   return res.status(400).json({
     msg: "Invalid Inputs",
     error: validation.error.issues,
   });
 }
  // Find the user by userId
  let findUser = await ReviewModel.findOne({ userId });
  if (!findUser) {
    return res.json({
      msg: "No items to update",
    });
  }

  const { title, description, rating, productId } = validation.data

  // Update the review with the matching productId
  findUser.review = findUser.review.map((ele) => {
    if (ele.productId.toString() === productId) {
      // Update the review fields
      ele.title = title;
      ele.description = description;
      ele.rating = rating;
    }
    return ele;
  });

  // Save the updated user review document
  await findUser.save();

  res.json({
    msg: "Review updated successfully",
    review: findUser,
  });}
  catch(e){
    console.log("Error WHile Updateing the Review",e)
    next(e)
  }
});


reviewRoutes.delete("/delete", authentication, async (req, res, next) => {
  try {
    const { userId } = req.user; // Get the userId from the authenticated user
    const { productId } = req.body; // Get the productId from the request body

    // Find the user by userId
    let findUser = await ReviewModel.findOne({ userId });
    if (!findUser) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    // Filter out the review with the given productId
    findUser.review = findUser.review.filter(
      (ele) => ele.productId.toString() !== productId
    );

    // Save the updated user document with the removed review
    await findUser.save();

    res.json({
      msg: "Review deleted successfully",
      review: findUser.review, // Return the updated reviews
    });
  } catch (e) {
    console.log("Error while deleting the review:", e);
    next(e); // Pass the error to the next middleware (e.g., error handler)
  }
});
