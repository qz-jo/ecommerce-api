const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

function signToken(user) {
  return jwt.sign(
    { role: user.role },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
      subject: String(user.id),
      expiresIn: process.env.JWT_EXPIRES_IN || "1h"
    }
  );
}

async function register(req, res, next) {
  try {
    const { full_name, email, phone, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, 'customer')
       RETURNING id, full_name, email, phone, role, is_active, created_at`,
      [full_name.trim(), normalizedEmail, phone || null, passwordHash]
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0]
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const result = await pool.query(
      "SELECT id, full_name, email, role, is_active, password_hash FROM users WHERE email = $1",
      [normalizedEmail]
    );

    const user = result.rows[0];
    const valid = user && user.password_hash
      ? await bcrypt.compare(password, user.password_hash)
      : false;

    if (!user || !valid || user.is_active === false) {
      console.warn(
        `[${new Date().toISOString()}] SECURITY login_failed ip=${req.ip || "unknown"}`
      );
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, phone, role, is_active, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login, me };
