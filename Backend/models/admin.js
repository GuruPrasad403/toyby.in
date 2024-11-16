import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },isAdmin: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    otp : {type:String}
});

// Pre-save middleware to update `updatedAt` on every save
adminSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

export const AdminModel = mongoose.model("Admin", adminSchema);
