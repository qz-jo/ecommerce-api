const express = require("express");
const { param } = require("express-validator");
const { getOrders, getOrderById } = require("../controllers/ordersController");
const authenticate = require("../middleware/authenticate");
const validate = require("../middleware/validate");

const router = express.Router();

router.use(authenticate);

router.get("/", getOrders);
router.get(
  "/:id",
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
  validate,
  getOrderById
);

module.exports = router;
