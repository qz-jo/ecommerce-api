const pool = require("../config/database");

async function getOrders(req, res, next) {
  try {
    if (req.user.role === "admin") {
      const result = await pool.query("SELECT * FROM orders ORDER BY id DESC");
      return res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows
      });
    }

    const result = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC",
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    return next(error);
  }
}

async function getOrderById(req, res, next) {
  try {
    const orderId = Number(req.params.id);

    if (req.user.role === "admin") {
      const adminResult = await pool.query(
        "SELECT * FROM orders WHERE id = $1",
        [orderId]
      );

      if (adminResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      return res.status(200).json({ success: true, data: adminResult.rows[0] });
    }

    const result = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [orderId, req.user.id]
    );

    if (result.rows.length === 0) {
      console.warn(
        `[${new Date().toISOString()}] SECURITY unauthorized_or_missing_order actor=${req.user.id} order=${orderId}`
      );
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getOrders, getOrderById };
