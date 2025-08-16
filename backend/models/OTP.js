const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const {emailVerificationTemplate} = require("../mail/templates/emailVerificationTemplate")

const OTPSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true
  },
  otp:{
    type:String,
    required:true
  }
},{ timestamps: true })

//A function to send mails
async function sendVerificationEmail(email,otp) {
  try {
    //Generate the HTML template with the OTP embedded
    const template = emailVerificationTemplate(otp, "User", "Course Name");

    // Send OTP email using the template
    const mailResponse = await mailSender(email, "Verification Email from StudyNotion", template);

    console.log("Email sent successfully: ",mailResponse)
  } 
  catch (error) {
    console.log("error occured while sending mails: ",error);
    throw error;
  }
}

OTPSchema.pre("save", async function(next) {
  try {
    await sendVerificationEmail(this.email, this.otp);
    next();
  } catch (error) {
    next(error); // important: pass error to stop saving if mail fails
  }
})

module.exports = mongoose.model("OTP",OTPSchema)
