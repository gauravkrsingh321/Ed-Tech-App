const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName:{
    type:String
  },
  courseDescription:{
    type:String
  },
  instructor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  whatYouWIllLearn:{
    type:String
  },
  courseContent:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Section",
    required:true
    }
  ],
  ratingAndReviews:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"RatingAndReviews",
    required:true
    }
  ],
  price:{
    type:Number
  },
  thumbnail:{
    type:String 
  },
  tag:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Tag"
  },
  studentsEnrolled: [
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    }
  ]
})

module.exports = mongoose.model("Course", courseSchema)