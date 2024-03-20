const express = require("express");
const router = express.Router();
const {
  addNewCategory,
  addNewSubCategory,
} = require("../controllers/adminControllers");
router.post("/add-category", addNewCategory);
router.post("/add-sub-category", addNewSubCategory);
module.exports = router;
