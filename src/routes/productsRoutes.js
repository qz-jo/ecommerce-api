const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct,
  deleteProduct
} = require("../controllers/productsController");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.patch("/:id/deactivate", deactivateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;