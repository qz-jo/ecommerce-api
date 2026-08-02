const pool = require("../config/database");

// 1. جلب جميع المستخدمين
async function getUsers(req, res) {
  try {
    const result = await pool.query("SELECT id, full_name, email, phone, role, is_active, created_at FROM users ORDER BY id ASC");
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve users" });
  }
}

// 2. جلب مستخدم بواسطة ID
async function getUserById(req, res) {
  try {
    const userId = Number(req.params.id);
    const result = await pool.query("SELECT id, full_name, email, phone, role, is_active, created_at FROM users WHERE id = $1", [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve user" });
  }
}

// 3. إنشاء مستخدم جديد
async function createUser(req, res) {
  try {
    const { full_name, email, phone, password_hash, role = "customer" } = req.body;

    if (!full_name || !email) {
      return res.status(400).json({ success: false, message: "Full name and email are required" });
    }

    const result = await pool.query(
      "INSERT INTO users (full_name, email, phone, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, email, phone, role, is_active, created_at",
      [full_name, email, phone || null, password_hash || null, role]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }
    res.status(500).json({ success: false, message: "Failed to create user" });
  }
}

// 4. تغيير حالة تفعيل المستخدم (Status)
async function updateUserStatus(req, res) {
  try {
    const userId = Number(req.params.id);
    const { is_active } = req.body;

    const result = await pool.query(
      "UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, full_name, email, is_active",
      [is_active, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update user status" });
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserStatus
};