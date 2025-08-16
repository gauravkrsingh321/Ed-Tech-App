const express = require("express");
const {createCategory, showAllCategories, categoryPageDetails} = require("../controllers/Category.Controller");

const {createRating, getAverageRating, getAllRating} = require("../controllers/RatingAndReview.Controller");

const {auth, isAdmin, isStudent, isInstructor} = require("../middlewares/auth");  

const { createCourse, getAllCourses, getCourseDetails } = require("../controllers/Course.Controller");

const { createSection, updateSection, deleteSection } = require("../controllers/Section.Controller");
const { updateSubSection, deleteSubSection, createSubSection } = require("../controllers/SubSection.Controller");

const router = express.Router();

//Courses can only be created by instructors
router.post("/createCourse",auth,isInstructor,createCourse);
//Add a section to a course
router.post("/addSection",auth,isInstructor,createSection);
//Update a section
router.put("/updateSection",auth,isInstructor,updateSection);
//Delete a section
router.post("/deleteSection",auth,isInstructor,deleteSection);
//Edit sub section
router.post("/updateSubSection",auth,isInstructor,updateSubSection);
//Delete sub section
router.post("/deleteSubSection",auth,isInstructor,deleteSubSection);
//Add a sub section to a section
router.post("/addSubSection",auth,isInstructor,createSubSection);
//Get all registered courses
router.get("/getAllCourses",getAllCourses);
//Get details for a specific courses
router.post("/getCourseDetails",getCourseDetails);

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", auth, isAdmin, showAllCategories);
router.post("/getCategoryPageDetails", auth, isAdmin, categoryPageDetails);

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

module.exports = router;
