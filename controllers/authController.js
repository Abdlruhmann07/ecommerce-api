const { promisify } = require("node:util");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const JWT_SECERET = process.env.JWT_SECERET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// signing token function
const signToken = function (user) {
  const payload = {
    email: user.email,
    id: user._id,
  };
  return jwt.sign(payload, JWT_SECERET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// signing users up
exports.signUp = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    dateOfBirth,
    sex,
    phoneNumber,
    photo,
    passwordChangedAt,
  } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    dateOfBirth: new Date(dateOfBirth),
    sex,
    phoneNumber,
    photo,
    passwordChangedAt,
  });
  // signing user token
  const token = signToken(newUser);

  return res.status(200).json({
    status: "OK",
    token,
    response: {
      message: "User Created!",
      data: newUser,
    },
  });
});

// loggin users in
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //? 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide an email and password ", 400)); // 400 Bad Request
  }
  //? 2) Check if email && password are correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparedHashedPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401)); // 401 Unauthorized
  }
  //? 3) If okay ? send token to the client
  const token = signToken(user);
  console.log(token);
  res.status(200).json({
    status: "OK",
    token,
  });
});

// log out users
exports.logout = (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.redirect("/api/v1/login");
};

// authentication middleware
exports.authenticate = catchAsync(async (req, res, next) => {
  //? 1) check if the token exist
  let token = "asda";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in , Please login to get access...", 401)
    );
  }
  //? 2) token Verification
  const decoded = await promisify(jwt.verify)(token, JWT_SECERET);
  console.log(decoded);
  //? 3) Check if user is still exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("User belonging to this token dose no loger exist.", 401)
    );
  }
  //? 4) Check if user changed his password after login ?
  if (await freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in!", 401)
    );
  }
  //* Grant access to protected routes..
  // set user to the req
  req.user = freshUser;
  next();
});
