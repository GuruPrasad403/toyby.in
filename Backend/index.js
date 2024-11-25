import express from 'express'
import cors from 'cors'
import {authRoutes} from './routes/authRoutes.js'
import Main from './config/Database.js'
import { PORT } from './config/env.js'
import { adminRoutes } from './routes/adminRoutes.js'
import { productRoutes } from './routes/productRoutes.js'
import { orderRoute } from './routes/orderRoutes.js'
import { userRoutes } from './routes/userRoutes.js'
import {cartRotues} from './routes/cartRoute.js'
import { reviewRoutes } from './routes/reviewRoutes.js'
import reportRoutes from './routes/reportsRoutes.js'

const app = express()
const Port = PORT|| '2500'
app.use(cors())
app.use(express.json())

app.use("/api",authRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/products",productRoutes)
app.use("/api/orders",orderRoute)
app.use("/api/user", userRoutes)
app.use("/api/cart/",cartRotues)
app.use("/api/review",reviewRoutes)
app.use("/api/reports",reportRoutes)
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