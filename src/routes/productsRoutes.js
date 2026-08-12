const express = require("express");
const { body, param } = require("express-validator");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct,
  deleteProduct
} = require("../controllers/productsController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");

const router = express.Router();

const idValidation = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer")
];

const productValidation = [
  body("category_id").isInt({ min: 1 }).withMessage("category_id must be a positive integer"),
  body("name").isString().trim().isLength({ min: 1, max: 150 }).withMessage("Product name must be 1-150 characters"),
  body("description").optional({ nullable: true }).isString().isLength({ max: 2000 }).withMessage("Description is too long"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than zero"),
  body("stock_quantity").optional().isInt({ min: 0 }).withMessage("stock_quantity must be a non-negative integer"),
  body("sku").isString().trim().isLength({ min: 1, max: 100 }).withMessage("SKU must be 1-100 characters")
];

router.get("/", getProducts);
router.get("/:id", idValidation, validate, getProductById);
router.post("/", authenticate, authorize("admin"), productValidation, validate, createProduct);
router.put("/:id", authenticate, authorize("admin"), [...idValidation, ...productValidation, body("is_active").isBoolean().withMessage("is_active must be boolean")], validate, updateProduct);
router.patch("/:id/deactivate", authenticate, authorize("admin"), idValidation, validate, deactivateProduct);
router.delete("/:id", authenticate, authorize("admin"), idValidation, validate, deleteProduct);

module.exports = router;
