//Protected route concept by middlewares
//3 middlewares => auth, isStudnet, isAdmin

const jwt = require("jsonwebtoken")
require("dotenv").config()

//For authentication
exports.auth = (req,res,next) => {
  try {
    //extract JWT token from body or jwt header section or cookie
    //3 ways to fetch token
    const token = req.body.token || req.cookies.token || req.header["authorization"].split(" ")[1]; //3rd way is most safe
    if(!token) { //if token not available
      return res.status(401).json({
        success:false,
        message:"Token Missing"
      }) 
    }

    //verify the token
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_sECRET) //Synchronously verify given token using a secret or a public key to get a decoded token 
      console.log(decodedToken);
      req.user = decodedToken; //We stored decodedToken(payload/data ) inside request because further we want to check if role is student or admin
      next();
    } 
    catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
  } 
  catch (error) {
    console.log(error)
    return res.status(401).json({
      success:false,
      message:"Something went wrong while verifying the token"
    }) 
  }
}

//For authorization
exports.isStudent = (req,res,next) => {
   try{
    if(req.user.role !== "Student") {
      return res.status(401).json({
        success:false,
        message:'This is a protected route for Students'
      })
    }
    next();
   }
   catch (error) {
    return res.status(500).json({
      success:false,
      message:"User Role is not matching"
    }) 
   }
}

//For authorization  
exports.isInstructor = (req,res,next) => {
  try{
    if(req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success:false,
        message:'This is a protected route for Instructor'
      })
    }
    next();
   }
   catch (error) {
    return res.status(500).json({
      success:false,
      message:"User Role is not matching"
    }) 
   }
}

//For authorization  
exports.isAdmin = (req,res,next) => {
  try{
    if(req.user.accountType !== "Admin") {
      return res.status(401).json({
        success:false,
        message:'This is a protected route for Admin'
      })
    }
    next();
   }
   catch (error) {
    return res.status(500).json({
      success:false,
      message:"User Role is not matching"
    }) 
   }
}