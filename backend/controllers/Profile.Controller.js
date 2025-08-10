const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req,res) => {
  try {
    //fetch data
    const {dateOfBirth="", about="", contactNumber} = req.body;
    //fetch userId
    const id = req.user.id;

    //validation
    if (!contactNumber || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    //update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    //return response
    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      profileDetails,
    });
  } 
  catch (error) {
     return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

exports.deleteAccount = async (req,res) => {
  try {
    //fetch id
    const id = req.user.id;
    //validation
    const user = await User.findById(id);
    if(!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //delete associated profile with the user  
    await Profile.findByIdAndDelete({_id:user.additionalDetails});
    //delete user
    await User.findByIdAndDelete({_id:id});
    //return response
    return res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
      updatedCourseDetails,
    });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "User cannot be deleted at the moment",
      error: error.message,
    });
  }
}

exports.getAllUserDetails = async (req,res) => {
  try {
    //get id
    const id = req.user.id;
    //get user details
    const userDetails = await User.findById(id).populate("additionalDetails").exec();
    //return response
     return res.status(200).json({
      success: true,
      message: "User Data Fetched Successfully",
    });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}