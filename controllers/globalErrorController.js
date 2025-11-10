const sendDevError = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  }
};
