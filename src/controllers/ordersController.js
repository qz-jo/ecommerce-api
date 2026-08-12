const pool = require("../config/database");

function getOwnerId(order) {
  const value = order.user_id ?? order.owner_id ?? order.id_owner ?? order.customer_id;
  const ownerId = Number(value);
  return Number.isInteger(ownerId) && ownerId > 0 ? ownerId : null;
}

async function getOrders(req, res, next) {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY id DESC");

    if (req.user.role === "admin") {
      return res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows
      });
    }

    const ownOrders = result.rows.filter((order) => getOwnerId(order) === req.user.id);

    return res.status(200).json({
      success: true,
      count: ownOrders.length,
      data: ownOrders
    });
  } catch (error) {
    next(error);
  }
}

async function getOrderById(req, res, next) {
  try {
    const orderId = Number(req.params.id);
    const result = await pool.query("SELECT * FROM orders WHERE id = $1", [orderId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = result.rows[0];
    const ownerId = getOwnerId(order);

    if (req.user.role !== "admin" && ownerId !== req.user.id) {
      console.warn(
        `[${new Date().toISOString()}] SECURITY unauthorized_order_access actor=${req.user.id} order=${orderId}`
      );
      // Return 404 to avoid revealing whether another user's order exists.
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

module.exports = { getOrders, getOrderById };
