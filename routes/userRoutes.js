const express = require("express");
const router = express.Router();
const { authenticate } = require("../controllers/authController");
const {
  getAllUsers,
  getSingleUser,
  postAd,
  getAllAds
} = require("../controllers/userController");

router.get("/all-users", authenticate, getAllUsers);
router.get("/single-user/:id", getSingleUser);
router.get("/all-ads", getAllAds);
router.post("/post-ad", postAd);

module.exports = router;
