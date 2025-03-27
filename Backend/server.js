import dotenv from "dotenv" 
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import router from "./routes/index.js";
import connectDB from "./db/index.js";
import "./utils/cronJobs.js"; // Ensure it runs when the server starts


dotenv.config();

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
//app.use(xss());
app.use(express.static("public"))
app.use(cookieParser())

app.use(router)


app.use((req, res)=>{
    res.status(404).send({message: 'route not found!'})
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })