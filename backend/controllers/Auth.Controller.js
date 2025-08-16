const User = require("../models/User");
const Profile = require("../models/Profile");
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Send OTP for email verification
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from body
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter email",
      });
    }
    //Check if user already present
    const user = await User.findOne({ email });
    if (user)
      return res.status(401).json({
        success: false,
        message: "User is already registered",
      });
    //generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP Generated: ", otp);

    //check unique otp or not
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    //create an entry for OTP
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    //return successful response
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//Signup
exports.signup = async (req, res) => {
  try {
    //get data
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //validate data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password does not match",
      });
    }

    //check if user already exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered. Please sign in to continue",
      });
    }

    //find most recent OTP stored for the user
    const recentOTP = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOTP);
    //validate OTP
    if (recentOTP.length === 0) {
      //OTP not found
      return res.status(400).json({
        success: false,
        message: "OTP Not found",
      });
    } else if (otp !== recentOTP[0].otp) {
      //Invalid OTP
      return res.status(400).json({
        success: false,
        message: "OTP not matching",
      });
    }

    //If user not found, hash the password using bcrypt.
    const hashedPassword = await bcrypt.hash(password, 10);

    let active = true; //user account is active by default
    let approved;
    if (accountType === "Instructor") {
      approved = false; // instructors need approval
    } else {
      approved = true; // students/admins are auto-approved
    }

    //create entry for new user in DB
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const createdUser = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      active,
      approved,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    //return response
    return res.status(200).json({
      success: true,
      message: "User Registered Successfully",
      createdUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User Cannot Be Registered, Please try again",
    });
  }
};

//Login
exports.login = async (req, res) => {
  try {
    //get data
    const { email, password } = req.body;
    //validate date
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    //Check if user exists or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      //if not a registered user
      return res.status(401).json({
        success: false,
        message: "User not registered. Please signup first.",
      });
    }
    // If user is found, check if password is correct
    // Verify password and generate a JWT token
    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };
    if (await bcrypt.compare(password, user.password)) {
      //password matched so logged in and generate a jwt token
      const token = jwt.sign(
        payload, //data
        process.env.JWT_SECRET, //secret
        {
          expiresIn: "2h", //options
        }
      );
      //More importantly, user is a Mongoose documentnot a plain JavaScript object. When you set alike user.token = token, it’s not automatically called when the document is serialized to JSON (like was response with res.json()), unless it’s schema or explicitly added.
      //✅ Solution: To include the token inside the user, Convert the Mongoose document to a plain object using .toObject():
      // const userData = user.toObject(); // plain JS object
      // userData.token = token;
      // userData.password = undefined;

      user.token = token;
      user.password = undefined;

      //create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), //abhi se 3 din tak
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User Logged In Successfully",
      });
    } else {
      //password do not match
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Password Incorrect",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure, please trya again",
    });
  }
};

//Change Password
exports.changePassword = async (req, res) => {
  try {
    //Get userId from token (middleware should already verify token & attach user to req.user)
    const userId = req.user.id;

    //Get oldPassword, newPassword, confirmNewPassword from body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    //Validation
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //Check newPassword and confirmNewPassword match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password and Confirm New Password do not match",
      });
    }

    //Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //Match old password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Old Password is incorrect",
      });
    }

    //Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    //Update password in DB
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while changing password, please try again",
    });
  }
};
