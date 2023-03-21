import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path" //This comes built in with node
import { fileURLToPath } from "url";  //This line and the one before will allow us to properly set the paths when we configure directories later on  

/*Configurations start=================================================================*/
const __filename = fileURLToPath(import.meta.url)       //
const __dirname = path.dirname(__filename)      
dotenv.config();        //Allows us to use env files
const app = express()  
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(morgan("common"))
 
//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors()) //invoke our cross origin resource sharing policies
app.use("/assets",express.static(path.join(__dirname, 'public/assets')))    //This sets the directory of where we keep our assets. We store this locally but in production we'd store this in cloud storage probably
/*Configurations end=================================================================*/

/*File Storage Start===================================================================*/
//How to save files - from Github for multer package
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, "public/assets")   //Anytime someone uploads a file into your website, it will be saved to this folder
    },
    filename:function (req,file,cb){
        cb(null,file.originalname)
    }
})

const upload = multer({storage})    //anytime we need to upload a file, we will be using this variable

/*File Storage End===================================================================*/

/*Mongoose Setup Start ==================================================*/
const PORT = process.env.port || 5008       //If our port that we set up in our env file is unavailable, we will try and connect to a different port. In this case, it is port 5008
mongoose.connect(process.env.MONGO_URL, {   //This connects to the actual database from our node server. And we are using the MONGO_URL that we created inside our .env file 
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(() => { //This is what happens after we connect
    app.listen(PORT, () => console.log( `Server Port ${PORT}`))
}).catch((error) => console.log(`${error} did not connect`))
