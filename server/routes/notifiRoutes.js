import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getNotification, updateNotification } from "../controllers/notifiController.js";

const router = express.Router();

router.get("/", auth, getNotification);
router.patch("/:chatId", auth, updateNotification);

export default router;
