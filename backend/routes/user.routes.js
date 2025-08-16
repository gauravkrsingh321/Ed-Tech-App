const express = require("express");
const router = express.Router();
const {login,signup,changePassword, sendOTP} = require("../controllers/Auth.Controller")
const {resetPassword,resetPasswordToken} = require("../controllers/ResetPassword.Controller")
const {auth} = require("../middlewares/auth")

//Route for user login
router.post('/login',login);

//Route for user signup
router.post('/signup',signup);

//Route for sending OTP to the user's email
router.post('/sendotp',sendOTP);

//Route for changing the password
router.post('/changepassword',changePassword);

//Route for generating a reset password token
router.post('/reset-password-token',resetPasswordToken);

//Route for changing the password
router.post('/reset-password',resetPassword);

module.exports = router;