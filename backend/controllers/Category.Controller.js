const Category = require('../models/Category');

exports.createCategory = async (req,res) => {
  try {
    const {name,description} = req.body;

    if(!name || !description) {
      return res.status(400).json({
      success:false,
      message:"All fields are required"
    })
    }

    const categoryDetails = await Category.create({name:name,description:description});
    console.log(categoryDetails)

    return res.status(201).json({
      success:true,
      message:"Category created successfully",
      categoryData: categoryDetails
    })
  } 
  catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

exports.showAllCategories = async (req,res) => {
  try {
    const allCategories = await Category.find({},{name:true,description:true}); //MongoDB will only return the fields you specify (name and description) plus _id by default for the second parameter of Model.find()
    return res.status(200).json({
      success:true,
      message:"All Categories fetched successfully",
      allCategories
    })
  } 
  catch (error) {
     return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}