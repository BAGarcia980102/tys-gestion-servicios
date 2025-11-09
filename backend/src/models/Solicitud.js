import { db } from "../config/db.js";

export const Solicitud = {
  // 🟠 Crear nueva solicitud
  async crear(data) {
    const {
      tipo,
      cliente,
      direccion,
      horario,
      contacto,
      telefono,
      referencia,
      propiedad,
      activo_fijo,
      falla,
      documentacion,
      diligencia,
      usuario_id,
    } = data;

    // Reemplaza undefined por null para evitar errores SQL
    const values = [
      tipo ?? null,
      cliente ?? null,
      direccion ?? null,
      horario ?? null,
      contacto ?? null,
      telefono ?? null,
      referencia ?? null,
      propiedad ?? null,
      activo_fijo ?? null,
      falla ?? null,
      documentacion ?? null,
      diligencia ?? null,
      usuario_id ?? null,
    ];

    const [result] = await db.execute(
      `INSERT INTO solicitudes 
      (tipo, cliente, direccion, horario, contacto, telefono, referencia, propiedad, activo_fijo, falla, documentacion, diligencia, usuario_id, fecha_creacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      values
    );

    return result.insertId;
  },

  // 🟢 Listar solicitudes asignadas al operativo
  async listarPorOperativo(idOperativo) {
    const [rows] = await db.execute(
      `SELECT 
          id,
          tipo,
          cliente,
          direccion,
          horario,
          contacto,
          telefono,
          referencia,
          propiedad,
          activo_fijo,
          falla,
          diligencia,
          documentacion,
          estado,
          fecha_creacion
       FROM solicitudes
       WHERE operativo_asignado = ?
       ORDER BY fecha_creacion DESC`,
      [idOperativo]
    );

    return rows;
  },
};
