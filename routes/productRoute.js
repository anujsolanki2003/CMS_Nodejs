const express = require("express");
const upload = require("../middleware/multer-config");
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addStock,
  updateStock,
  deleteStock,
} = require("../controllers/productController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Add new product
router.post("/add", verifyToken, upload.single("image"), addProduct);

// Get all products
router.get("/", getProducts);

// Get single product by ID
router.get("/products/:id", getProductById);

// Update product
router.put("/products/:id", verifyToken, updateProduct);

// Delete product
router.delete("/:id", verifyToken, deleteProduct);

// Adding stock
router.post("/stock/:id", verifyToken, addStock);

// stock update
router.put(
  "/stock/:productId/:stockId",
  verifyToken,

  updateStock
);

// delete stock
router.delete("/stock/:productId/:stockId", verifyToken, deleteStock);

module.exports = router;
