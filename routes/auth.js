const express = require("express");
const router = express.Router();
// improting controller middlewares
const { signUp, login } = require("../controllers/authController");
// sigin up users
router.post("/sign-up", signUp);
router.post("/login", login);
//
// router.put(
//   "/update-user/:id",
//   catchAsync(async (req, res, next) => {
//     const id = req.params.id;
//     const updatedUser = await User.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     if (!updatedUser) {
//       return next(new AppError("No user found with this id", 404));
//     }

//     return res.status(200).json({
//       status: "OK",
//       response: {
//         message: "User Updated!",
//         data: updatedUser,
//       },
//     });
//   })
// );
router.get("/login", (req, res, next) => {
    res.render('login')
});
module.exports = router;
