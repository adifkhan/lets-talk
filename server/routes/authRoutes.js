import express from "express";
import { login, logout, register, update } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.patch("/update/:userId", update);

export default router;
