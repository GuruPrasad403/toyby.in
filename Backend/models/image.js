import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            maxlength: 100, // Optional: Set a max length for readability
        },
        url: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (v) => {
                    return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i.test(v);
                },
                message: "Invalid image URL format",
            },
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500, // Optional: Limit the description length
        },
        status: {
            type: String,
            enum: ["active", "inactive", "archived"], // Flexible status options
            default: "active",
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

export const ImageModel = mongoose.model("Image", ImageSchema);
