const AppError = require("../utils/AppError");
// handle dublicate errors on database to be operational errors
const handleDublicateDB = (err) => {
  const message = ` ${
    err.keyValue.name || err.keyValue.email
  }  is already exist , Please try another one!`;
  return new AppError(message, 400);
};
// handle casting errors on database to be operational errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};
// handle validation erros on database to be operational errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data! ${errors.join(". ")}`;
  return new AppError(message, 400);
};
// handle JWT errors to be operational errors
const handleJwtError = () =>
  new AppError("Invalid token , Please log in!", 401);
// handle JWT expires error
const handleJwtExpire = () =>
  new AppError("Token has expired , Please log in!", 401);
// sending error to development enviroment
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// sending error to production enviroment
const sendErrorProd = (err, res) => {
  // Operational ,trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming errors , Unkown errors: don't leak error details
  } else {
    // 1) log error
    console.error("ERROR 💥");
    // 2) send generic message
    res.status(500).json({
      status: "error",
      message: "Somthing went wrong!",
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    // Preserve the message property during shallow copy
    if (err.message) error.message = err.message;
    //!
    if (err.name === "CastError") error = handleCastErrorDB(error);

    if (err.name === "ValidationError") error = handleValidationErrorDB(error);

    if (err.name === "JsonWebTokenError") error = handleJwtError();

    if (err.name === "TokenExpiredError") error = handleJwtExpire();

    if (err.code === 11000) error = handleDublicateDB(error);

    sendErrorProd(error, res);
  }
};
