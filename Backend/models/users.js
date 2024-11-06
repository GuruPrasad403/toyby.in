import mongoose  from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId //object id type for refering to a different table in the data base 
const addressSchema = new mongoose.Schema({
    street:{type :String,required :true},
    Zip:{type:Number,required:true},
    City:{type :String,required :true},
    District:{type :String,required :true},
    Country:{type :String,required :true}

}) //defineing an schema for an address
const userSchema = new mongoose.Schema({
    name: {type :String,required :true},
    email: {type :String,required :true,unique:true},
    password: {type :String,required :true},
    createdAt: { type: Date, default: Date.now },
    isAdmin:{type:Boolean,default : false},
    isVarified :{type:Boolean,default:false},
    phone:{type:String,required:true, unique:true}

});


export const UserModel = mongoose.model("User",userSchema)
