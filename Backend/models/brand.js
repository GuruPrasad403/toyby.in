import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Brand name is required"],
        unique: true,
        trim: true,
        maxlength: [100, "Brand name cannot exceed 100 characters"],
    },
    imageId: {
        type: mongoose.Types.ObjectId,
        ref: "Image",
        required: [true, "Brand image is required"],
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Archived"],
        default: "Active",
    },
    description: {
        type: String,
        maxlength: [500, "Description cannot exceed 500 characters"],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Pre-save middleware for additional business logic (if needed)
BrandSchema.pre('save', function(next) {
    this.updatedAt = Date.now(); // Update `updatedAt` on each save
    next();
});

export const BrandModel = mongoose.model("Brand", BrandSchema);
