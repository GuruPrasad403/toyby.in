import express from 'express'
import cors from 'cors'
const app = express()
const Port = process.env.PORT || '2500'
app.use(cors())
app.use(express.json())


app.listen(Port,(req,res)=>{
    console.log("server is running at "+ Port)
})
