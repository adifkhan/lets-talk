import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, profilePic } = req.body;

  try {
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please enter all required fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const newUser = await User.create({
      name,
      email,
      password,
      profilePic,
    });

    if (newUser) {
      const { password, ...rest } = newUser.toObject();
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res
        .cookie("accessToken", token, {
          httpOnly: true,
          // secure: process.env.NODE_ENV === "production",
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json(rest);
    } else {
      res.status(404);
      throw new Error("Something went wrong! try again");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.isValidPassword(password))) {
      const { password, ...rest } = user.toObject();
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res
        .cookie("accessToken", token, {
          httpOnly: true,
          // secure: process.env.NODE_ENV === "production",
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json(rest);
    } else {
      res.status(400);
      throw new Error("Invalid user credentials");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const logout = (req, res) => {
  try {
    res
      .clearCookie("accessToken", { secure: true, sameSite: "none" })
      .status(200)
      .json({ message: "user signed out" });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};
