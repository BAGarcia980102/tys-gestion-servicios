import { Solicitud } from "../models/Solicitud.js";
import { db } from "../config/db.js";

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
export const listarSolicitudesOperativo = async (req, res) => {
  try {
    const idOperativo = req.user.id; // viene del token
    const solicitudes = await Solicitud.listarPorOperativo(idOperativo);
    res.status(200).json(solicitudes);
  } catch (error) {
    console.error("Error al listar solicitudes del operativo:", error);
    res.status(500).json({ message: "Error al obtener solicitudes" });
  }
};

export const asignarSolicitud = async (req, res) => {
  const { id } = req.params;
  const { operativo_id } = req.body;

  try {
    // Obtener fecha de creación
    const [solicitud] = await db.execute("SELECT fecha_creacion FROM solicitudes WHERE id = ?", [id]);
    if (solicitud.length === 0) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    const fechaCreacion = new Date(solicitud[0].fecha_creacion);
    const fechaAsignacion = new Date();
    const minutos = Math.floor((fechaAsignacion - fechaCreacion) / 60000);

    // Actualizar solicitud
    await db.execute(
      "UPDATE solicitudes SET operativo_asignado = ?, estado = 'Asignada', fecha_asignacion = ? WHERE id = ?",
      [operativo_id, fechaAsignacion, id]
    );

    // Registrar en historial
    await db.execute(
      "INSERT INTO historial_asignaciones (solicitud_id, operativo_id, fecha_asignacion, tiempo_transcurrido) VALUES (?, ?, ?, ?)",
      [id, operativo_id, fechaAsignacion, minutos]
    );

    // Obtener nombre del operativo asignado
    const [op] = await db.execute("SELECT nombre FROM usuarios WHERE id = ?", [operativo_id]);
    const nombreOperativo = op[0]?.nombre || "Desconocido";

    // ✅ Respuesta completa para el frontend
    res.status(200).json({
      message: "Solicitud asignada correctamente",
      tiempo: minutos,
      fecha_asignacion: fechaAsignacion,
      operativo: nombreOperativo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al asignar solicitud" });
  }
};

export const obtenerTodas = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT 
        s.id,
        s.tipo,
        s.cliente,
        s.direccion,
        s.horario,
        s.contacto,
        s.telefono,
        s.referencia,
        s.propiedad,
        s.activo_fijo,
        s.falla,
        s.documentacion,
        s.diligencia,
        s.estado,
        s.operativo_asignado,
        s.fecha_creacion,
        s.fecha_asignacion,
        u.nombre AS asesor
      FROM solicitudes s
      LEFT JOIN usuarios u ON s.usuario_id = u.id
      ORDER BY s.fecha_creacion DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    res.status(500).json({ message: "Error al obtener solicitudes" });
  }
};

