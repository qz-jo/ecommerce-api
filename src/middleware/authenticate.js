const jwt = require("jsonwebtoken");
const pool = require("../config/database");

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"]
    });
    const userId = Number(payload.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    const result = await pool.query(
      "SELECT id, role, is_active FROM users WHERE id = $1",
      [userId]
    );

    const user = result.rows[0];
    if (!user || user.is_active === false) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    req.user = {
      id: user.id,
      role: user.role
    };

    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" || error.name === "NotBeforeError") {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
    return next(error);
  }
}

module.exports = authenticate;
