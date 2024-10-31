import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getMessages, postMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", auth, postMessage);
router.get("/:chatId", auth, getMessages);

export default router;
