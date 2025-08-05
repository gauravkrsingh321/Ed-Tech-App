const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const {uploadToCloudinary} = require("../utils/Uploader")

exports.createSubSection = async (req,res) => {
  try {
    //fetch data
    const {sectionId,title,timeDuration,description} = req.body;
    //extract file/video
    const video = req.files?.videoFile;
    //validation
     if (!sectionId|| !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //upload video to cloudinary 
    const uploadDetails = await uploadToCloudinary(video, process.env.FOLDER_NAME);
    //create a sub-section
    const SubSectionDetails = await SubSection.create({
      title:title,
      timeDuration:timeDuration,
      description:description,
      videoUrl:uploadDetails.secure_url
    })
    //update section with this sub section ObjectId
    const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
      {$push:{subSection:SubSectionDetails._id}},
      {new:true}
    ).populate("subSection");
    //return response
     return res.status(201).json({
      success: true,
      message: "Sub Section Created Successfully",
      updatedSection,
    });
  } 
  catch (error) {
     return res.status(500).json({
      success: false,
      message: "Unable to create sub section, please try again",
      error: error.message,
    });
  }
}


exports.updateSubSection = async (req,res) => {
  try {
    //fetch data
    const {subsectionId,title,timeDuration,description} = req.body;
    //extract file/video
    const video = req.files?.videoFile;
    //validation
     if (!subsectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //upload new video to cloudinary 
    const uploadDetails = await uploadToCloudinary(video, process.env.FOLDER_NAME);
    //update subsection
        const updatedSubSection = await SubSection.findByIdAndUpdate(
          subsectionId,
          { title,timeDuration,description,videoUrl:uploadDetails.secure_url},
          { new: true }
        );
    
        return res.status(200).json({
          success: true,
          message: "Sub-Section Updated Successfully",
          updatedSubSection
        });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update sub-section, please try again",
      error: error.message,
    });
  }
}


exports.deleteSubSection = async (req,res) => {
  try {
    const {subsectionId } = req.params;
    
        if(!subsectionId) {
          return res.status(400).json({
            success: false,
            message: "Sub Section ID is required",
          });
        }
    
        await SubSection.findByIdAndDelete(subsectionId);
    
        return res.status(200).json({
          success: true,
          message: "Sub Section Deleted Successfully",
        });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete Sub Section, please try again",
      error: error.message,
    });
  }
}