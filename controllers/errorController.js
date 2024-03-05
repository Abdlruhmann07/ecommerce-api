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
const handleJwtError = (err) =>
  new AppError("Invalid token , Please log in!", 401);
// handle JWT expires error
const handleJwtExpire = (err) =>
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
    console.error("ERROR 💥", err.name);
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
    // } else if (process.env.NODE_ENV === "production") {
    //   let error = { ...err };

    //   if (error.name == "CastError") error = handleCastErrorDB(error);

    //   sendErrorProd(err, res);
    // }
  } else {
    let error = { ...err };

    if (err.name === "CastError") {
      error = handleCastErrorDB(error);
      sendErrorProd(error, res);
    } else if (err.name === "ValidationError") {
      console.log("validation");
      error = handleValidationErrorDB(error);
      sendErrorProd(error, res);
    } else if (err.name === "JsonWebTokenError") {
      error = handleJwtError(error);
      sendErrorProd(error, res);
    } else if (err.name === "TokenExpiredError") {
      error = handleJwtExpire(error);
      sendErrorProd(error, res);
    } else if ((error.code = 11000)) {
      error = handleDublicateDB(error);
      sendErrorProd(error, res);
    } else {
      sendErrorProd(err, res);
    }
  }
};
