const express = require("express");
const { body, param } = require("express-validator");
const { getUsers, getUserById, createUser, updateUserStatus } = require("../controllers/usersController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");

const router = express.Router();

const idValidation = [param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer")];

router.use(authenticate);

router.get("/", authorize("admin"), getUsers);
router.get("/:id", idValidation, validate, getUserById);
router.post(
  "/",
  authorize("admin"),
  body("full_name").isString().trim().isLength({ min: 2, max: 100 }).withMessage("Full name must be 2-100 characters"),
  body("email").isEmail().normalizeEmail().withMessage("A valid email is required"),
  body("phone").optional({ nullable: true }).isString().isLength({ max: 30 }).withMessage("Phone is too long"),
  body("password").isString().isLength({ min: 8, max: 128 }).withMessage("Password must be 8-128 characters"),
  body("role").isIn(["customer", "admin"]).withMessage("Role must be customer or admin"),
  validate,
  createUser
);
router.patch(
  "/:id/status",
  authorize("admin"),
  idValidation,
  body("is_active").isBoolean().withMessage("is_active must be boolean"),
  validate,
  updateUserStatus
);

module.exports = router;
