import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";

export const postMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;

  if (!chatId || !content) {
    res.status(400);
    throw new Error("Invalid request");
  }

  try {
    let newMessage = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    newMessage = await newMessage.populate([
      {
        path: "sender",
        select: "name email profilePic",
      },
      {
        path: "chat",
        populate: {
          path: "users",
          match: { _id: { $ne: req.user._id } },
          select: "name email profilePic",
        },
      },
    ]);

    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate([
        {
          path: "sender",
          select: "name email profilePic",
        },
        {
          path: "chat",
          populate: {
            path: "users",
            match: { _id: { $ne: req.user._id } },
            select: "name email profilePic",
          },
        },
      ])
      .sort({ updatedAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
