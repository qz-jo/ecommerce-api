const express = require("express");
const { body } = require("express-validator");
const { register, login, me } = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");
const validate = require("../middleware/validate");
const { loginLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

const registerValidation = [
  body("full_name").isString().trim().isLength({ min: 2, max: 100 }).withMessage("Full name must be 2-100 characters"),
  body("email").isEmail().normalizeEmail().withMessage("A valid email is required"),
  body("phone").optional({ nullable: true }).isString().trim().isLength({ max: 30 }).withMessage("Phone is too long"),
  body("password").isString().isLength({ min: 8, max: 128 }).withMessage("Password must be 8-128 characters"),
  body("role").not().exists().withMessage("Role cannot be set during public registration")
];

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("A valid email is required"),
  body("password").isString().notEmpty().withMessage("Password is required")
];

router.post("/register", registerValidation, validate, register);
router.post("/login", loginLimiter, loginValidation, validate, login);
router.get("/me", authenticate, me);

module.exports = router;
