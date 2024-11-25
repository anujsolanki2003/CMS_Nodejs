const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoute");
const categoryRoutes = require("./routes/categoryRoute");
const productRoutes = require("./routes/productRoute");
const { registerAdmin } = require("./controllers/authController");
const dotenv = require("dotenv").config();
const Category = require("./models/categoryModel");
const Subcategory = require("./models/subCategoryModel");
const Product = require("./models/productModel");
const Stock = require("./models/stockModel");
const User = require("./models/userModel");
const bodyParser = require("body-parser");
const multer = require("multer");

const app = express();

// CORS setup
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const upload = multer({ dest: "public/uploads/" });

// Static file serving

app.use("/uploads", express.static("public/uploads"));

// Set up associations
Category.associate({ Subcategory });
Subcategory.associate({ Category });
Product.associate({ Category, Subcategory, User, Stock });
Stock.associate({ Product });
User.associate = () => {};

// Sequelize authentication
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((err) => {
    console.log("Error connecting to the database: ", err);
  });

// Sync database and register admin
sequelize.sync().then(registerAdmin);

// Routes
app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
