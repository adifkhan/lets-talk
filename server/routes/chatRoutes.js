import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getChats, accessChat, groupChat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", auth, accessChat);
router.get("/", auth, getChats);
router.patch("/group", auth, groupChat);

export default router;
