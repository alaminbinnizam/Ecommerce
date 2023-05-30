
import express from "express";
import dotenv from 'dotenv';
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js'
import cors from "cors";
import path from 'path';
import { fileURLToPath } from "url";
//configure
dotenv.config();
//data base configure
connectDB();

//esmodule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express();
//middlewares
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes)
app.use(express.static(path.join(__dirname, './clientside/build')))

//restapi
app.use('*', function(req, res){
    res.sendFile(path.join(__dirname, './clientside/build/index.html'))
})

//port
const PORT = process.env.PORT || 8000

//run listen
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})