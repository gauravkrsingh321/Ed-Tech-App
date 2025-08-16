const express = require('express');
const app = express();

const userRoutes = require("./routes/user.routes")
const profileRoutes = require("./routes/profile.routes")
// const paymentRoutes = require("./routes/payments.routes")
const courseRoutes = require("./routes/course.routes")

const connectToDB = require('./config/db');
const cookieParser = require("cookie-parser");
const cors = require("cors")
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload")
require("dotenv").config(); 
  
const PORT = process.env.PORT || 5000;

// Connect to MongoDB   
connectToDB();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp"
    })
)

//cloudinary connection
cloudinaryConnect()

//mount routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
// app.use("/api/v1/payment", paymentRoutes);

//default route
app.get("/", (req,res) => {
    return res.json({
        success:true,
        message:"Your server is up and running...."
    })
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});