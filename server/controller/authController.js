const userModel = require("../model/userModel");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const bcrypt = require("bcrypt");

// create token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const isProduction = process.env.NODE_ENV === "production"; // detect prod
  const cookieExpiresDays = Number(process.env.JWT_COOKIE_EXPIRES_IN || 7);

  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true, // true in production, false locally
    sameSite: "none", // "none" for cross-domain in prod
  };

  res.cookie("jwt", token, cookieOptions);

  // Do not send password
  const userSafe = user.toObject ? user.toObject() : { ...user };
  delete userSafe.password;

  res.status(statusCode).json({
    status: "success",
    data: { user: userSafe },
  });
};

// user signup
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;
    if (!name || !email || !password || !passwordConfirm) {
      return next(new AppError("Missing signup fields", 400));
    }
    if (password !== passwordConfirm) {
      return next(new AppError("Passwords do not match", 400));
    }

    const newUser = await userModel.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    next(new AppError(err.message || "Signup failed", 400));
  }
};

// user login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError("Incorrect email or password", 401));
    }

    const correct = await bcrypt.compare(password, user.password);
    if (!correct) {
      return next(new AppError("Incorrect email or password", 401));
    }

    createSendToken(user, 200, res);
  } catch (err) {
    next(new AppError(err.message || "Login failed", 400));
  }
};

// protect middleware
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError("You are not logged in", 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await userModel.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists", 401)
      );
    }

    req.user = currentUser;
    next();
  } catch (error) {
    next(new AppError(`Failed to protect route: ${error.message}`, 401));
  }
};

// logout
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ status: "success" });
};
