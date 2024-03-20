const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const CategoryModel = require("../models/category");
const SubCategoryModel = require("../models/subCategory");

// add new category
exports.addNewCategory = catchAsync(async (req, res, next) => {
  const { title, description, subCategories, dynamicAdFields } = req.body;
  const newCategory = await CategoryModel.create({
    title,
    description,
    subCategories,
    dynamicAdFields,
  });
  return res.status(200).json({
    status: "Ok",
    response: { message: "Created Successfully", data: newCategory },
  });
});

// add new sub category
exports.addNewSubCategory = catchAsync(async (req, res, next) => {
  const { title, category } = req.body;
  const newSubCategory = await SubCategoryModel.create({
    title,
    category,
  });
  // adding the new sub category to it's category
  const Category = await CategoryModel.findById(category);
  if (!Category) {
    return next(new AppError("There is no category with this id", 404));
  }
  Category.subCategories.push(newSubCategory._id);
  await Category.save({ validateBeforeSave: false });
  // send a response
  return res.status(200).json({
    status: "Ok",
    response: { message: "Created Successfully", data: newSubCategory },
  });
});
