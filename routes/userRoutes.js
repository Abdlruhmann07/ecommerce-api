const express = require("express");
const router = express.Router();
const { authenticate } = require("../controllers/authController");
const { getAllUsers } = require("../controllers/userController");

router.get("/all-users", authenticate, getAllUsers);

module.exports = router;
