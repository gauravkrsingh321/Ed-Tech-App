//Protected route concept by middlewares
//3 middlewares => auth, isStudnet, isAdmin

const jwt = require("jsonwebtoken")
require("dotenv").config()

//For authentication
exports.auth = (req,res,next) => {
  try {
    //extract JWT token from body or jwt header section or cookie
    // const token = req.body.token || req.cookies.token || req.header["authorisation"].split(" ")[1]; //3rd way is most safe
    const token = req.body.token || req.cookies.token || req.header["Authorisation"].replace("Bearer ", ""); //3rd way is most safe
    if(!token) { 
      return res.status(401).json({
        success:false,
        message:"Token Missing"
      }) 
    }

    //verify the token
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_sECRET) //Synchronously verify given token using a secret 
      console.log(decodedToken);
      req.user = decodedToken; //We stored decodedToken(payload/data ) inside request because further we want to check if role is student or admin
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
    next();
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
    if(req.user.accountType !== "Student") {
      return res.status(401).json({
        success:false,
        message:'This is a protected route for Students Only'
      })
    }
    next();
   }
   catch (error) {
    return res.status(500).json({
      success:false,
      message:"User Role cannot be verified, please try again"
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
      message:"User Role is not matching only"
    }) 
   }
}

//For authorization  
exports.isAdmin = (req,res,next) => {
  try{
    if(req.user.accountType !== "Admin") {
      return res.status(401).json({
        success:false,
        message:'This is a protected route for Admin only'
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