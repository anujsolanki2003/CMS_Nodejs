const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("Rentify", "root", "sol@4217", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
