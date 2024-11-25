const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  addCategory,
  addSubcategory,
  getCategories,
  getSubcategories,
  deleteCategory,
  updateCategory,
  getCategory,
  updateSubcategory,
  deleteSubcategory,
  getSubcategoriesByCategoryId,
} = require("../controllers/categoryController");

// category end points
router.post("/categories", verifyToken, addCategory);
router.get("/categories", getCategory);
router.put("/categories/:id", verifyToken, updateCategory);
router.delete("/categories/:id", verifyToken, deleteCategory);

// sub category end points

router.post("/categories/subcategories", verifyToken, addSubcategory);
router.get("/categories/subcategories", getSubcategories);
router.get(
  "/categories/subcategoriesbyid",

  getSubcategoriesByCategoryId
);
router.put("/categories/subCategories/:id", verifyToken, updateSubcategory);
router.delete("/categories/subCategories/:id", verifyToken, deleteSubcategory);

module.exports = router;
