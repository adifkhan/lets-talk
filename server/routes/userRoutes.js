import express from "express";
import { getUsers, getAuth } from "../controllers/userController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", auth, getUsers);
router.get("/auth", auth, getAuth);

export default router;
