import express from 'express'
import cors from 'cors'
import {authRoutes} from './routes/authRoutes.js'
import Main from './config/Database.js'
const app = express()
const Port = process.env.PORT || '2500'
app.use(cors())
app.use(express.json())

app.use("/api",authRoutes)




authRoutes.use((err, req, res, next) => {
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