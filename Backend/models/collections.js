import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema(
    {
        collectionName: {
            type: String,
            enum: ["New-Collection", "New-Arrivals", "Best-Sellers"],
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product", // Reference to the Product model
            required: true,
        },
    },
    {
        timestamps: true, // Automatically manage `createdAt` and `updatedAt`
    }
);

const CollectionModel = mongoose.model("Collection", CollectionSchema);

export default CollectionModel;
