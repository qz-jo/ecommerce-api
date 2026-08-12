const express = require("express");
const { body, param } = require("express-validator");
const { getCategories, getCategoryById, createCategory, updateCategory } = require("../controllers/categoriesController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");

const router = express.Router();

const idValidation = [param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer")];
const categoryValidation = [
  body("name").isString().trim().isLength({ min: 1, max: 100 }).withMessage("Category name must be 1-100 characters"),
  body("description").optional({ nullable: true }).isString().isLength({ max: 1000 }).withMessage("Description is too long")
];

router.get("/", getCategories);
router.get("/:id", idValidation, validate, getCategoryById);
router.post("/", authenticate, authorize("admin"), categoryValidation, validate, createCategory);
router.put("/:id", authenticate, authorize("admin"), [...idValidation, ...categoryValidation, body("is_active").isBoolean().withMessage("is_active must be boolean")], validate, updateCategory);

module.exports = router;
