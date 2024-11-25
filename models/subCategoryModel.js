const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./categoryModel");

const Subcategory = sequelize.define("Subcategory", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  addedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Subcategory.associate = (models) => {
  Subcategory.belongsTo(models.Category, {
    foreignKey: "categoryId",
    as: "category",
  });
};

module.exports = Subcategory;
