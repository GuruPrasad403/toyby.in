import mongoose from "mongoose";
const {ObjectId} = mongoose.Types
const reviewSchema = new mongoose.Schema({
    userId: {type: String,required: true},
    review:[{
        productId: {type:ObjectId,require:true},
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        }

    }]
})


export const ReviewModel = mongoose.model("Review",reviewSchema)