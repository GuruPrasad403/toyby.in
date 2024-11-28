import mongoose  from "mongoose"
const ObjectID = mongoose.Schema.Types.ObjectId

const Order = new mongoose.Schema({
    user:{type:ObjectID,ref:'User',required:true},
    items:[{
        productId:{type:ObjectID,ref:'Product',required:true},
        quantity:{type:Number,required:true,min:1,default:1},
        price:{type:Number,required:true}
    }],
    status:{type:String,enum:['Pending', 'Shipped', 'Delivered', 'Cancelled'],default:"Pending"},
    deliverDate:{
        type:Date,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }


})

export const OrdersModel = mongoose.model("Orders",Order) 