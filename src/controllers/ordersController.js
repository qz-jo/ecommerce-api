const pool = require("../config/database");

// The task PDF requires order ownership checks but does not specify the exact
// ownership column used by the existing Neon schema. This static PostgreSQL
// expression safely supports the common names without building SQL from user input.
const ORDER_OWNER_SQL = `COALESCE(
  (to_jsonb(orders)->>'user_id')::bigint,
  (to_jsonb(orders)->>'owner_id')::bigint,
  (to_jsonb(orders)->>'id_owner')::bigint,
  (to_jsonb(orders)->>'customer_id')::bigint
)`;

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
      `SELECT * FROM orders WHERE ${ORDER_OWNER_SQL} = $1 ORDER BY id DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
}

async function getOrderById(req, res, next) {
  try {
    const orderId = Number(req.params.id);

    if (req.user.role === "admin") {
      const adminResult = await pool.query("SELECT * FROM orders WHERE id = $1", [orderId]);

      if (adminResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      return res.status(200).json({ success: true, data: adminResult.rows[0] });
    }

    const result = await pool.query(
      `SELECT * FROM orders WHERE id = $1 AND ${ORDER_OWNER_SQL} = $2`,
      [orderId, req.user.id]
    );

    if (result.rows.length === 0) {
      console.warn(
        `[${new Date().toISOString()}] SECURITY unauthorized_or_missing_order actor=${req.user.id} order=${orderId}`
      );
      // 404 prevents disclosing whether another user's order exists.
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

module.exports = { getOrders, getOrderById };
