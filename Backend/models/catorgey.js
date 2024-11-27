import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    image: {
        type: String,
        match: /\.(jpeg|jpg|gif|png|svg)$/i, // Validate file format
    },
    status: {
        type: Boolean,
        enum: [true,false],
        default: 'Active',
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Reference to another Category document
        default: null, // Null means it's a top-level category
    },
    subCategories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category", // Reference to subcategories
        }
    ],
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

// Pre-save middleware to generate a slug from the name
CategorySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/[\s]+/g, '-');
    }
    next();
});

// Export the model
export const CategoryModel = mongoose.model("Category", CategorySchema);
