const User = require("../models/User")
const Profile = require("../models/Profile")
const OTP = require("../models/OTP")
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator")

//Send OTP
exports.sendOTP = async (req,res) => {
  try {
    //fetch otp and email from body
    const {otp,email} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({success:false,message:"User not registered,register first"})
    //generate otp and save/verify
    const newOtp = await OTP.generate(6,{
      uppercaseOnly:false,
      lowercaseOnly:false,
    })
  } 
  catch (error) {
    console.log(error)
    return res.status(500).json({
      success:false,
      message:"Internal Servor Error"
    })
  }
}

//Signup
exports.signup = async (req,res) => {
  try {
    //get data
    const {name,email,password,confirmpassword,accountType} = req.body; 
    if(!name || !email || !password) {
      return res.status(400).json({
        success:false,
        message:"Please enter all details"
      })
    }
    //check if user already exists
    const existingUser = await User.findOne({email});
    if(existingUser) {
      return res.status(400).json({
        success:false,
        message:"User already exists"
      })
    }
    //If user not found, hash the password using bcrypt.
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password,10); 
    } 
    catch (error) {
      return res.status(500).json({
        success:false,
        message:"Error in hashing password"
      })
    }
    //create entry for new user
    const createdUser = await User.create({name,email,password:hashedPassword,role});
    return res.status(200).json({
      success:true,
      message:"User Created Successfully  "
    })
  }   
  catch (error) {
    console.log(error)
    return res.status(500).json({
      success:false,
      message:"User Cannot Be Registered, Please try again later"
    })
  }
}

//Login
exports.login = async (req, res) => {
  try {
    //get data
    const { email, password } = req.body;
    //if email and password is empty 
    if(!email || !password) {
      return res.status(400).json({
        success:false,
        message:"Please enter email and password"
      })
    }
    //Check if user exists
    const user = await User.findOne({ email });
    if(!user) { //if not a registered user
      return res.status(401).json({
        success: false,
        message: "User not registered. Please signup first."
      });
    }
    // If user is found, check if password is correct
    // Verify password and generate a JWT token
    const payload = {
      email:user.email,
      id:user._id,
      accountType:user.accountType
    };
    if(await bcrypt.compare(password, user.password)) {
       //password matched so logged in and generate a jwt token
       let token = jwt.sign(payload, //data
                            process.env.JWT_SECRET,  //secret
                            {
                              expiresIn:"2h", //options
                            });
      //More importantly, user is a Mongoose documentnot a plain JavaScript object. When you set alike user.token = token, it’s not automatically called when the document is serialized to JSON (like was response with res.json()), unless it’s schema or explicitly added.
      //✅ Solution: To include the token inside the user, Convert the Mongoose document to a plain object using .toObject():                 
       const userData = user.toObject(); // plain JS object
       userData.token = token;
       userData.password = undefined;
       const options = {
        expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000), //abhi se 3 din tak
        httpOnly: true
       }
       res.cookie("token",token,options).status(200).json({   
        success:true,
        token,
        user:userData,
        message:"User Logged In Successfully"
       })
    }
    else {
       //password do not match
       return res.status(403).json({
        success: false,
        message: "Invalid credentials. Password Incorrect"
      });  
    }
  } 
  
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure",
    });
  }
}


//Change Password
