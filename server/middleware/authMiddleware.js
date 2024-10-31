import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const auth = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    // console.log("token", req.cookies);
    if (!token) {
      res.status(401);
      throw new Error("Unauthorized access");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const auth = await User.findById(decoded?._id).select("-password -__v");

    if (!auth) {
      res.status(403);
      throw new Error("Access denied");
    }
    req.user = auth;
    next();
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

export default auth;
