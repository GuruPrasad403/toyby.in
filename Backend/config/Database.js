import mongoose from 'mongoose'
import { UserModel } from '../models/users.js';

 export default async function Main ()
{
    try{
        await mongoose.connect("mongodb+srv://Chandu:chandu8951@toyby.45zuj.mongodb.net/?retryWrites=true&w=majority")
         console.log("Database is Connceted ")

    }
    catch (e) {
        console.log("Error Occured to connect to Database ")
        console.log("Go through the Error Below")
        console.log(e)
    }
}



