import express from 'express'
import cors from 'cors'
import {authRoutes} from './routes/authRoutes.js'
import Main from './config/Database.js'
import { PORT } from './config/env.js'
import { adminRoutes } from './routes/adminRoutes.js'
const app = express()
const Port = PORT|| '2500'
app.use(cors())
app.use(express.json())

app.use("/api",authRoutes)
app.use("/api/admin",adminRoutes)
app.get("/",(req,res)=>{
    res.json({msg:"This is the Backend"})
})

app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: status
        }
    });
    next()
});


try{
    Main()
    app.listen(Port,(req,res)=>{
        console.log("server is running at "+ Port)
    })
}
catch(e){
    console.log(e)
}