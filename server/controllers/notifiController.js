import asyncHandler from "express-async-handler";
import Notification from "../models/notificatonModel.js";

export const getNotification = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.aggregate([
      {
        $match: { receiver: req.user._id },
      },
      {
        $group: {
          _id: "$chat",
          notification: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$notification" },
      },
    ]);

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const updateNotification = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  try {
    await Notification.updateMany(
      { chat: chatId, receiver: req.user._id },
      { $pull: { receiver: req.user._id } }
    );

    // deleting all document that has no receiver
    await Notification.deleteMany({ receiver: { $size: 0 } });
    res.status(200).json("notification removed");
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
