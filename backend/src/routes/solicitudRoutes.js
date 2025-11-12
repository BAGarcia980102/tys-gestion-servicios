import express from "express";
import {
  crearSolicitud,
  listarSolicitudesOperativo,
  asignarSolicitud,
  obtenerTodas
} from "../controllers/solicitudController.js"; // ✅ corregido
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Crear solicitud (HU-07)
router.post("/", verificarToken, crearSolicitud);

// Listar solicitudes asignadas al operativo (HU-11)
router.get("/operativo", verificarToken, listarSolicitudesOperativo);

// Asignar solicitud (HU-02)
router.put("/asignar/:id", verificarToken, asignarSolicitud);

// Obtener todas las solicitudes (para coordinador)
router.get("/", verificarToken, obtenerTodas);

export default router;
