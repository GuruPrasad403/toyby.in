import mongoose from 'mongoose'
import { UserModel } from '../models/users.js';
import { DB_URL } from './env.js';
 export default async function Main ()
{
    try{
        console.log(DB_URL)
        await mongoose.connect(DB_URL)
         console.log("Database is Connceted ")

    }
    catch (e) {
        console.log("Error Occured to connect to Database ")
        console.log("Go through the Error Below")
        console.log(e)
    }
}



