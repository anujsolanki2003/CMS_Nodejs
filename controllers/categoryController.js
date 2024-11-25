const Category = require("../models/categoryModel");
const Subcategory = require("../models/subCategoryModel");

// Add Category
const addCategory = async (req, res) => {
  try {
    const { name, addedBy } = req.body;
    const category = await Category.create({ name, addedBy });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const categories = await Category.findAll({});
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Subcategory
const addSubcategory = async (req, res) => {
  try {
    const { name, categoryId, addedBy } = req.body;
    if (!categoryId) {
      return res.status(400).json({ error: "categoryId is required" });
    }

    // Check if category exists
    const categoryExists = await Category.findByPk(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ error: "Category not found" });
    }

    const subcategory = await Subcategory.create({ name, categoryId, addedBy });
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Subcategory
const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId, addedBy } = req.body;

    const subcategory = await Subcategory.findByPk(id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    if (name !== undefined) {
      subcategory.name = name;
    }
    if (categoryId !== undefined) {
      subcategory.categoryId = categoryId;
    }
    if (addedBy !== undefined) {
      subcategory.addedBy = addedBy;
    }

    await subcategory.save();
    res.status(200).json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Subcategory
const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Subcategory.destroy({ where: { id } });
    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all Categories with Subcategories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Subcategory, as: "subcategories" }],
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.findAll({
      include: [{ model: Category, as: "category", attributes: ["name"] }],
    });
    res.status(200).json(subcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.destroy({ where: { id } });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, addedBy } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name !== undefined) {
      category.name = name;
    }
    if (addedBy !== undefined) {
      category.addedBy = addedBy;
    }

    await category.save();
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get subcategories by categoryId
const getSubcategoriesByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.query;
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const subcategories = await Subcategory.find({ categoryId });

    if (subcategories.length === 0) {
      return res
        .status(404)
        .json({ message: "No subcategories found for this category" });
    }

    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
  addSubcategory,
  getCategory,
  updateSubcategory,
  deleteSubcategory,
  getSubcategories,
  getSubcategoriesByCategoryId,
};
