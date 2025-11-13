import express from "express";
import {
  crearSolicitud,
  listarSolicitudesOperativo,
  asignarSolicitud,
  obtenerTodas,
  validarSolicitud,
  listarPorAsesor,
  editarSolicitud,
  detalleSolicitud,
  reprogramarSolicitud,
  archivarSolicitud
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
router.get("/todas", verificarToken, obtenerTodas);
router.put("/validar/:id", verificarToken, validarSolicitud);
router.get("/asesor", verificarToken, listarPorAsesor);
router.put("/editar/:id", verificarToken, editarSolicitud);
router.get("/detalle/:id", verificarToken, detalleSolicitud);
router.put("/reprogramar/:id", verificarToken, reprogramarSolicitud);
router.put("/archivar/:id", verificarToken, archivarSolicitud);


export default router;
