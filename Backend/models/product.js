import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId; // object id type for referring to a different table in the database

const productSchema = new mongoose.Schema({
    adminId: { type: ObjectId, ref: "Admin" },
    title: { type: String, unique: true, required: true },
    description: { type: String },
    category: { type: String, required: true },
    price: { type: String, default: 0, required: true },
    discountPercentage: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    imageUrls: [{ type: String }],
    stock: { type: Number, default: 0 },
    brand: { type: String, default: "Generic" },
    Wheight: { type: Number, default: 0 },
    dimensions: {
        width: { type: Number, default: 0, required: false },
        height: { type: Number, default: 0, required: false },
        deep: { type: Number, default: 0, required: false }
    },
    warrantyInformation: { type: String, required: true },
    shippingInformation: { type: String, required: true },
    returnPolicy: { type: String, default: "7 Days Return" },
    minimumOrderQuantity: { type: Number, default: 1 },
    thumbnailImageUrls: [{ type: String }],
    productType: { type: String, required: true },
    isActive: { type: Boolean, default: false },

    // New Fields for Toy-specific Information
    ageRange: { type: String, required: true }, // e.g., "3-5 years", "6+ years"
    material: { type: String, required: true }, // e.g., "Plastic", "Wood"
    safetyInformation: { type: String, default: "No small parts for children under 3" },
    tags: [{ type: String }] // e.g., ["educational", "interactive"]
});

export const ProductModel = mongoose.model("Product", productSchema);
