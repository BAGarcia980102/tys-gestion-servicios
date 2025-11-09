import express from "express";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { crearSolicitud, listarSolicitudesOperativo } from "../controllers/solicitudController.js";

const router = express.Router();

// Ruta de prueba
router.get("/test", (req, res) => {
  res.send("✅ Rutas de solicitudes funcionando correctamente");
});

// Crear solicitud (asesor)
router.post("/", verificarToken, crearSolicitud);

// Listar solicitudes (operativo)
router.get("/operativo", verificarToken, listarSolicitudesOperativo);

export default router;
