import mongoose from 'mongoose'


async function Main ()
{
    try{
        await  mongoose.connect("")
        console.log("Database is Connceted ")
    }
    catch (e) {
        console.log("Error Occured to connect to Database ")
        console.log("Go through the Error Below")
        console.log(e)
    }
}

Main()

