const userModel = require("../model/userModel");
const appError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

//create token

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};
//user sighnup
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm, role } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
      return next(new appError("Please provide all required fields", 400));
    }

    if (password !== passwordConfirm) {
      return next(new appError("Passwords do not match", 400));
    }

    const newUser = await userModel.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    const token = signToken(newUser._id);
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      // secure: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      status: "success",
      token,
      data: { user: newUser },
    });
  } catch (error) {
    next(new appError(`Failed to create user: ${error.message}`, 400));
  }
};

//user login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new appError("Please provide login and password", 404));
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new appError("Invalid email or password", 401));
    }

    const token = signToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log("JWT cookie set:", res.getHeader("Set-Cookie"));

    res.status(200).json({
      status: "Success",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

//protect
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new appError("You are not logged in", 401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await userModel.findById(decoded.id);
    if (!currentUser) {
      return next(
        new appError("The user belonging to this token no longer exists", 401)
      );
    }
    req.user = currentUser;
    next();
  } catch (error) {
    next(new appError(`Failed to protect route: ${error.message}`, 400));
  }
};

//logout
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};
