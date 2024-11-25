const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Product = require("./productModel");

const Stock = sequelize.define("Stock", {
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  totalQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Stock.associate = (models) => {
  Stock.belongsTo(models.Product, {
    foreignKey: "productId",
    as: "product",
  });
};

module.exports = Stock;
