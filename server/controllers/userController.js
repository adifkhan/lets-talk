import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

export const getUsers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = { _id: { $ne: req.user._id } };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  try {
    const users = await User.find(filter).select("-password -__v");
    res.status(200).json(users);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const getAuth = asyncHandler(async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
