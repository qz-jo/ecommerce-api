function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(`[${new Date().toISOString()}]`, error);
  }

  const status = Number(error.status || error.statusCode) || 500;
  const safeStatus = status >= 400 && status < 600 ? status : 500;

  res.status(safeStatus).json({
    success: false,
    message: safeStatus === 500 ? "Internal server error" : (error.publicMessage || error.message || "Request failed")
  });
}

module.exports = errorHandler;
