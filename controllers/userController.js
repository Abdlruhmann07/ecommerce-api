const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

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
