import express from "express";
import {
  crearSolicitud,
  listarSolicitudesOperativo,
} from "../controllers/solicitudController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Crear solicitud (HU-07)
router.post("/", verificarToken, crearSolicitud);

// Listar solicitudes asignadas al operativo (HU-11)
router.get("/operativo", verificarToken, listarSolicitudesOperativo);

export default router;
