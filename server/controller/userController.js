const userModel = require("../model/userModel");
const appError = require("../utils/appError");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(new appError("Failed to get users", 404));
  }
};

// Get a single user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    console.log(user);
    if (!user) {
      return next(new appError("User not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    next(new appError(`Failed to get user: ${error.message}`, 404));
  }
};

// Update a user by ID
exports.updateUserById = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await userModel.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return next(new appError("User not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    next(new appError("Failed to update user", 400));
  }
};
// Delete a user by ID
exports.deleteUserById = async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new appError("User not found", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new appError("Failed to delete user", 400));
  }
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
