import { Solicitud } from "../models/Solicitud.js";

// 🟢 Crear solicitud
export const crearSolicitud = async (req, res) => {
  try {
    const usuario_id = req.user.id; // viene del token
    const data = { ...req.body, usuario_id };
    const id = await Solicitud.crear(data);
    res.status(201).json({ message: "Solicitud creada con éxito", id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la solicitud" });
  }
};

// 🟢 Listar solicitudes del operativo
export const listarSolicitudesOperativo = async (req, res) => {
  try {
    const idOperativo = req.user.id;
    const solicitudes = await Solicitud.listarPorOperativo(idOperativo);
    res.status(200).json(solicitudes);
  } catch (error) {
    console.error("❌ Error exacto en listarSolicitudesOperativo:", error);
    res.status(500).json({ message: "Error al obtener solicitudes", error: error.message });
  }
};

