const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Models
const Category = require("./categoryModel");
const Subcategory = require("./subCategoryModel");
const User = require("./userModel");

const Product = sequelize.define("Product", {
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  subcategoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Subcategory,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  addedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

// Associations
Product.associate = (models) => {
  Product.belongsTo(models.Category, {
    foreignKey: "categoryId",
    as: "category",
  });
  Product.belongsTo(models.Subcategory, {
    foreignKey: "subcategoryId",
    as: "subcategory",
  });
  Product.belongsTo(models.User, {
    foreignKey: "addedBy",
    as: "user",
  });

  Product.hasMany(models.Stock, {
    foreignKey: "productId",
    as: "stock",
  });
};

module.exports = Product;
