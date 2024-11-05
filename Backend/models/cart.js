import mongoose, { Types } from "mongoose";

const Schema = new mongoose.Schema()
const ObjectId = mongoose.Schema.Types.ObjectId;
const CartSchema = new Schema({
    itmes:[{
        productID:{type:ObjectId,ref:"Product",required:true},
        quantity:{type:Number,required:true,min:1,default:1},
        price:{type:Number,required:true}
    }],
    userId:{type:ObjectId,required:true,ref:"User"},
    totalPrice:{type:Number,required:true,default:0},
    status:{type:String,enum:["active","purchased"],default:"active" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

export const CartModel = mongoose.model("Cart",CartSchema)