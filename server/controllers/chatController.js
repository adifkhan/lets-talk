import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";

export const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  try {
    const chat = await Chat.find({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    }).populate([
      {
        path: "users",
        match: { _id: { $ne: req.user._id } },
        select: "name email profilePic",
      },
      {
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "name email profilePic",
        },
      },
    ]);

    if (chat.length > 0) {
      res.status(200).json(chat[0]);
    } else {
      const newChat = await Chat.create({
        users: [req.user._id, userId],
        isGroupChat: false,
      });

      const populatedChat = await newChat.populate([
        {
          path: "users",
          select: "name email profilePic",
        },
      ]);
      res.status(201).json(populatedChat);
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const getChats = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user._id })
      .populate([
        {
          path: "users",
          match: { _id: { $ne: req.user._id } },
          select: "name email profilePic",
        },
        {
          path: "admin",
          select: "name email profilePic",
        },
        {
          path: "latestMessage",
          populate: {
            path: "sender",
            select: "name email profilePic",
          },
        },
      ])
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const groupChat = asyncHandler(async (req, res) => {
  const { id } = req.query;
  let { chatName, users } = req.body;

  if (!chatName) {
    return res.status(400).json({ message: "Chat name is required" });
  }
  if (!users || users.length < 2) {
    return res.status(400).json({ message: "Minimum 2 members are required" });
  }
  if (!users.includes(req.user._id.toString())) {
    users.push(req.user._id.toString());
  }

  try {
    if (id && id !== "undefined") {
      const isExistingChat = await Chat.findOne({
        _id: id,
      });

      if (isExistingChat) {
        const result = await Chat.findOneAndUpdate(
          { _id: id },
          {
            chatName,
            users,
          },
          { new: true }
        ).populate([
          {
            path: "users",
            match: { _id: { $ne: req.user._id } },
            select: "name email profilePic",
          },
          {
            path: "admin",
            select: "name email profilePic",
          },
        ]);

        return res.status(200).json(result);
      }
    }

    const newChat = await Chat.create({
      chatName,
      isGroupChat: true,
      users,
      admin: req.user._id,
    });

    const populatedChat = await newChat.populate([
      {
        path: "users",
        match: { _id: { $ne: req.user._id } },
        select: "name email profilePic",
      },
      {
        path: "admin",
        select: "name email profilePic",
      },
    ]);

    res.status(201).json(populatedChat);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
