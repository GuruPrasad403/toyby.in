import mongoose  from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId //object id type for refering to a different table in the data base 
const Schema = new mongoose.Schema() //creating an object for an Schema class
const addressSchema = new Schema({
    street:{type :String,required :true},
    Zip:{type:Number,required:true},
    City:{type :String,required :true},
    District:{type :String,required :true},
    Country:{type :String,required :true}

}) //defineing an schema for an address
const userSchema = new Schema({
    name: {type :String,required :true},
    email: {type :String,required :true,unique:true},
    password: {type :String,required :true},
    createdAt: { type: Date, default: Date.now },
    contact:addressSchema,
    isAdmin:{type:Boolean,default : false},
    isVarified :{type:Boolean,default:false},
    phone:{type:Number,required:true, unique:true},
    cart :[{
        product_id : {type : ObjectId, ref:"product"}, //[product_id of an product]
        quenty_num : Number

    }],

});


export const UserModel = mongoose.model("User",userSchema)
