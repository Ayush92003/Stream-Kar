import express from "express";
import "dotenv/config";

import authRoutes from "./routes/authRoutes.js"
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import { connectDB } from "./lib/db.js";
import cookieParser from 'cookie-parser'



const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes)
app.use("/api/users", userRoutes);
app.use("/api/chat",chatRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
    connectDB();
})
