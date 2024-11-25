const Product = require("../models/productModel");
const Stock = require("../models/stockModel");
const Category = require("../models/categoryModel");
const Subcategory = require("../models/subCategoryModel");
const User = require("../models/userModel");
const path = require("path");

// Add Product with Image
const addProduct = async (req, res) => {
  try {
    // console.log("Request body:", req.body);
    // console.log("Uploaded file:", req.file);

    const {
      productName,
      model,
      description,
      categoryId,
      subcategoryId,
      size,
      price,
      color,
      totalQuantity,
    } = req.body;

    if (!productName || !categoryId || !req.file) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const userId = req.user.id;

    const newProduct = await Product.create({
      productName,
      image: `/uploads/${req.file.filename}`,
      model,
      description,
      categoryId: parseInt(categoryId, 10),
      subcategoryId: subcategoryId ? parseInt(subcategoryId, 10) : null,
      addedBy: userId,
    });

    if (totalQuantity) {
      await Stock.create({
        productId: newProduct.id,
        size,
        price: parseFloat(price),
        color,
        totalQuantity: parseInt(totalQuantity, 10),
      });
    }

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return res
      .status(500)
      .json({ message: "Error adding product", error: error.message || error });
  }
};

// Get All Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Stock,
          as: "stock",
        },
        {
          model: Category,
          as: "category",
        },
        {
          model: Subcategory,
          as: "subcategory",
        },
        {
          model: User,
          as: "user",
          attributes: ["name"],
        },
      ],
    });

    return res.status(200).json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving products", error });
  }
};

// Get a Single Product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Stock,
          as: "stock",
        },
        {
          model: Category,
          as: "category",
        },
        {
          model: Subcategory,
          as: "subcategory",
        },
        {
          model: User,
          as: "user",
          attributes: ["name"],
        },
      ],
    });

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    //console.log(product);

    return res.status(200).json(product);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Error retrieving product", error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("this is id", req);
    const { productName, model, description, categoryId, subcategoryId } =
      req.body;
    console.log("this is the product name from fe", productName);
    const image = req.file ? req.file.path : null;

    const product = await Product.findOne({
      where: { id: id },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // console.log("get product with fields:", product);
    console.log("get product with fields:", product.dataValues);

    // Prepare updated fields
    // const updatedFields = {};
    // if (productName) product.productName = productName;
    // if (model) product.model = model;
    // if (description) product.description = description;
    // if (categoryId) product.categoryId = categoryId;
    // if (subcategoryId) product.subcategoryId = subcategoryId;
    // if (image) product.image = image;

    console.log("productName", productName);

    // Update the product
    await Product.update(
      {
        productName,
        model,
        description,
        categoryId,
        subcategoryId,
        image,
      },
      { where: { id: id } }
    );

    const updatedProduct = await Product.findByPk(id);
    // console.log("Updated product data:", updatedProduct);

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Error updating product", error });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Stock.destroy({
      where: { productId: id },
    });

    await product.destroy();

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Error deleting product", error });
  }
};

// Update Stock Data
const updateStock = async (req, res) => {
  try {
    const { productId, stockId } = req.params;
    const { size, color, price, totalQuantity } = req.body;

    const existingStock = await Stock.findOne({
      where: { id: stockId, productId },
    });

    if (!existingStock) {
      return res
        .status(404)
        .json({ message: "Stock for this product not found" });
    }

    // Update the stock details
    await existingStock.update({
      size,
      color,
      price,
      totalQuantity,
    });

    return res.status(200).json({
      message: "Stock updated successfully",
      stock: existingStock,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating stock", error });
  }
};

// Delete Stock Data
const deleteStock = async (req, res) => {
  try {
    const { productId, stockId } = req.params;

    const existingStock = await Stock.findOne({
      where: { id: stockId, productId },
    });

    if (!existingStock) {
      return res
        .status(404)
        .json({ message: "Stock for this product not found" });
    }

    await existingStock.destroy();

    return res.status(200).json({
      message: "Stock deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting stock", error });
  }
};

const addStock = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { size, price, color, totalQuantity } = req.body;
    const productId = req.params.id;

    if (!productId || !size || !price || !color || !totalQuantity) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newStock = await Stock.create({
      productId: parseInt(productId, 10),
      size,
      price: parseFloat(price),
      color,
      totalQuantity: parseInt(totalQuantity, 10),
    });

    return res.status(201).json({
      message: "Stock added successfully",
      stock: newStock,
    });
  } catch (error) {
    console.error("Error adding stock:", error);
    return res.status(500).json({
      message: "Error adding stock",
      error: error.message || error,
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
  deleteStock,
  addStock,
};
