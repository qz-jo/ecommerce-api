function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(`[${new Date().toISOString()}]`, error);
  }

  let status = Number(error.status || error.statusCode) || 500;
  let message = error.publicMessage;

  if (error.type === "entity.too.large") {
    status = 413;
    message = "Request body is too large";
  } else if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    status = 400;
    message = "Invalid JSON body";
  }

  if (status < 400 || status >= 600) {
    status = 500;
  }

  if (!message) {
    message = status === 500 ? "Internal server error" : "Request failed";
  }

  return res.status(status).json({
    success: false,
    message
  });
}

module.exports = errorHandler;
