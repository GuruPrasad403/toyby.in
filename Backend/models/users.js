import mongoose  from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId //object id type for refering to a different table in the data base 
const userSchema = new mongoose.Schema({
    name: {type :String,required :true},
    email: {type :String,required :true,unique:true},
    password: {type :String,required :true},
    createdAt: { type: Date, default: Date.now },
    isVarified :{type:Boolean,default:false},
    phone:{type:String,required:true, unique:true},
    
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },

});


export const UserModel = mongoose.model("User",userSchema)
