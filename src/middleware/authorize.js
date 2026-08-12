function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.warn(
        `[${new Date().toISOString()}] SECURITY authorization_denied actor=${req.user.id} role=${req.user.role} method=${req.method} path=${req.path}`
      );
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return next();
  };
}

module.exports = authorize;
