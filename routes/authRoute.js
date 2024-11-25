const express = require("express");
const {
  login,
  createUser,
  getAllUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/login", login);
// create user
router.post("/user", verifyToken, createUser);

// get all user
router.get("/user/getUser", verifyToken, getAllUser);

//update user
router.put("/user/updateUser/:id", verifyToken, updateUser);

// delete user
router.delete("/user/deleteUser/:id", verifyToken, deleteUser);

module.exports = router;
