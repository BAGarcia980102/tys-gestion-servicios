import express from "express";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { obtenerOperativos } from "../controllers/usuarioController.js";

const router = express.Router();

// ✅ Ruta: GET /api/usuarios/operativos
router.get("/operativos", verificarToken, obtenerOperativos);

export default router;
