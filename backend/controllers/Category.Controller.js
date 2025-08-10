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
      error:error.message
    })
  }
}

exports.categoryPageDetails = async(req,res) => {
  try {
    const {categoryId} = req.body;

    //Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId).populate("courses").exec();

    //Handle the case when the category is not found
    if(!selectedCategory) {
      return res.status(404).json({
      success:false,
      message:"Category not found."
     })
    }

    //Handle the case when there are no courses
    if(selectedCategory.courses.length === 0) {
      return res.status(404).json({
      success:false,
      message:"No courses found for the selected category."
     })
    }

    const selectedCourses = selectedCategory.courses;

    //Get courses for other/different categories
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    }).populate("courses"); 

    //Get top-selling courses across all categories
    const allCategories = await Category.find().populate("courses");
    const allCourses = allCategories.flatMap((category)=>category.courses);
    const mostSellingCourses = allCourses.sort((a,b) => b.sold - a.sold).slice(0,10);

    res.status(200).json({
      success:true,
      data: {
        selectedCategory,
        differentCategories,
        mostSellingCourses
      }
    })

  } 
  catch (error) {
    console.log(error);
     return res.status(500).json({
      success:false,
      message:"Internal Server Error",
      error:error.message
    })
  }
}