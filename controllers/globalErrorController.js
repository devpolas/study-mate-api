const AppError = require("../utils/appError");

function handelDuplicateError(err) {
  const message = `${
    err.keyValue.name || err.keyValue.email
  } already have! Please try another!`;
  return new AppError(message, 400);
}

function handleCastError(err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}
function handleJWTerror() {
  return new AppError("Please login first!", 401);
}

const sendDevError = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProductionError = (err, res) => {
  console.log(err);
  // Don't send accidentally other error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // when it was not operational error send the default error
    res.status(500).json({
      status: "error",
      message: "something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  }

  let error = { ...err, name: err.name };
  if (err.code === 11000) {
    error = handelDuplicateError(error);
  }
  if (error.name === "CastError") {
    error = handleCastError(error);
  }
  if (error.name === "TokenExpiredError" || "JsonWebTokenError") {
    error = handleJWTerror();
  }

  // Send safe Production Error
  sendProductionError(error, res);
};
