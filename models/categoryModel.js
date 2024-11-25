const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define("Category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  addedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Category.associate = (models) => {
  Category.hasMany(models.Subcategory, {
    foreignKey: "categoryId",
    as: "subcategories",
  });
};

module.exports = Category;
