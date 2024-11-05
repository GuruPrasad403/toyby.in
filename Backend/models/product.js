import mongoose  from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId //object id type for refering to a different table in the data base 
const Schema = new mongoose.Schema() //creating an object for an Schema class


const productSchema = new Schema({
    adminId:{type:ObjectId,ref:"Admin"},
    title : {type:String, unique:true, required:true},
    discription:{type:String, unique:true, required:true},
    category:{type:String, required:true},
    price:{type:String,default:0, required:true},
    discountPercentage:{type:Number,default:0},
    rating:{type:Number, default:0},
    imageUrls:[{type:String}],
    createdBy:{type:ObjectId, ref:'User'},
    stock:{type:Number,default:0,},
    brand:{type:String,default:"Genric"},
    Wheight:{type:Number,default:0},
    dimensions:{
        width:{type:number,default:0,required:true},
        height:{type:number,default:0,required:true},
        deep:{type:number,default:0,required:true}
    },
    warrantyInformation:{type:String,required:true},
    shippingInformation:{type:String,required:true},
    returnPolicy:{type:String,default:"7 Days Return"},
    minimumOederQuantitya :{type:Number, default:1},
    thubhumnailImageUrls:[{type:String}],
    productType:{type:String,required:true},
    isActive:{type:Boolean,default:false},
    reviews:[{
        userId:{type:ObjectId,required:true,ref:'User'},
        name:{type:String,require:true},
        discription:{type:String,require:true},
        review:{type:Number,require:true}
    }]


})

export const ProductModel = mongoose.model("Product",productSchema)
