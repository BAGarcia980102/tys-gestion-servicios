import express from "express";
import { crearSolicitud } from "../controllers/solicitudController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verificarToken, crearSolicitud);

export default router;
