const User = require("../models/user");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const CategoryModel = require("../models/category");
const AdModel = require("../models/Ad");

// GET : ALL Users : PRIVATE
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});
  if (users.length === 0) {
    return res.status(200).json({
      status: "OK",
      response: {
        message: "No users yet!",
        data: "",
      },
    });
  }
  return res.status(200).json({
    status: "OK",
    response: users,
  });
});

// GET : Single User
exports.getSingleUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("no user with that id", 404));
  }
  return res.status(200).json({
    status: "OK",
    response: user,
  });
});

// Post an advertisement
exports.postAd = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    category,
    userInfo,
    price,
    brand,
    condition,
    dynamicAdFields,
  } = req.body;
  const Category = await CategoryModel.findById(category);
  if (!Category) {
    return next(new AppError("There is no category with this id", 404));
  }

  // create new ad document
  const newAd = await AdModel.create({
    title,
    description,
    category,
    userInfo,
    price,
    brand,
    condition,
    dynamicAdFields,
  });

  // send a response
  return res.status(200).json({
    status: "OK",
    response: {
      message: "Ad published successfully",
      data: newAd,
    },
  });
});

// Get all ads
exports.getAllAds = catchAsync(async (req, res, next) => {
  // Build Query
  // 1A) Filtering
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);
  // 1B) Advanced Filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = AdModel.find(JSON.parse(queryStr));

  // 2) sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query.sort("-publishedIn");
  }

  // 3) Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  const totalDocs = await AdModel.countDocuments({});
  const totalPages = Math.ceil(totalDocs / limit);

  query = query.skip(skip).limit(limit);

  // EXCUTE THE QUERY
  const ads = await query;
  // Resopnse
  return res.status(200).json({
    status: "OK",
    response: {
      ads,
      totalPages,
      totalDocs,
    },
  });
});
