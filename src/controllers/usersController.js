const bcrypt = require("bcryptjs");
const pool = require("../config/database");

async function getUsers(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, phone, role, is_active, created_at FROM users ORDER BY id ASC"
    );
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const userId = Number(req.params.id);

    if (req.user.role !== "admin" && req.user.id !== userId) {
      console.warn(`[${new Date().toISOString()}] SECURITY unauthorized_user_access actor=${req.user.id} target=${userId}`);
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const result = await pool.query(
      "SELECT id, full_name, email, phone, role, is_active, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const { full_name, email, phone, password, role } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, phone, role, is_active, created_at`,
      [full_name.trim(), email.toLowerCase(), phone || null, passwordHash, role]
    );

    console.info(`[${new Date().toISOString()}] SECURITY admin_created_user actor=${req.user.id} created=${result.rows[0].id} role=${role}`);

    res.status(201).json({ success: true, message: "User created successfully", data: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }
    next(error);
  }
}

async function updateUserStatus(req, res, next) {
  try {
    const userId = Number(req.params.id);
    const { is_active } = req.body;

    const result = await pool.query(
      "UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, full_name, email, role, is_active",
      [is_active, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.info(`[${new Date().toISOString()}] SECURITY user_status_changed actor=${req.user.id} target=${userId} active=${is_active}`);

    res.status(200).json({ success: true, message: "User status updated successfully", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

module.exports = { getUsers, getUserById, createUser, updateUserStatus };
