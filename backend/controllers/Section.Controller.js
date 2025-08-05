const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    //fetch data
    const { sectionName, courseId } = req.body;

    //validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //create section
    const newSection = await Section.create({ sectionName });

    //push this section to course i.e. update course with section ObjectId
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    ).populate({
      path: "courseContent",
      populate: {
        path: "subSection", // populate subsections of each section
      },
    });

    //return response
    return res.status(201).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails,
    });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create section, please try again",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;

    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Section Updated Successfully",
    });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update section, please try again",
      error: error.message,
    });
  }
};


exports.deleteSection = async (req, res) => {
  try {
    const {sectionId } = req.params;

    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "Section ID is required",
      });
    }

    await Section.findByIdAndDelete(sectionId);

    return res.status(200).json({
      success: true,
      message: "Section Deleted Successfully",
    });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete section, please try again",
      error: error.message,
    });
  }
}