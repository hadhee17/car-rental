const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");
const router = express.Router();

// User routes
router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get(
  "/me",
  authController.protect,
  userController.getMe,
  userController.getUserById
);

module.exports = router;
