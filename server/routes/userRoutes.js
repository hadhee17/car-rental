const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");
const router = express.Router();

// Auth routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Protected route for current user
router.get(
  "/me",
  authController.protect,
  userController.getMe,
  userController.getUserById
);

router.route("/logout").post(authController.logout);

// General user routes
router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById);

module.exports = router;
