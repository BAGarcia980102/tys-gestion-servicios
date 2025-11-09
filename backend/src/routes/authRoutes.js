// backend/src/routes/authRoutes.js
import express from "express";
import { login } from "../controllers/authController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔹 Ruta de login
router.post("/login", login);

// 🔹 NUEVA ruta para verificar token
router.get("/verify", verificarToken, (req, res) => {
  res.status(200).json({
    valid: true,
    user: req.user,
    message: "Token válido",
  });
});

export default router;
