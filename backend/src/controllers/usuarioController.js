import { db } from "../config/db.js";

// ✅ Obtener todos los operativos (solo id y nombre)
export const obtenerOperativos = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, nombre FROM usuarios WHERE rol = 'operativo'"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener operativos:", error);
    res.status(500).json({ message: "Error al obtener operativos" });
  }
};
