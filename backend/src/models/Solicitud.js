import { db } from "../config/db.js";

export const Solicitud = {

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

    const safeValues = [
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
      safeValues
    );

    return result.insertId;
  },

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

  async listarTodas() {
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
        s.estado_validacion,
        s.fecha_creacion,
        u.nombre AS creado_por
      FROM solicitudes s
      LEFT JOIN usuarios u ON s.usuario_id = u.id
      ORDER BY s.fecha_creacion ASC`
    );
    return rows;
  },

  async validar(id, estado) {
    const [result] = await db.execute(
      `UPDATE solicitudes 
       SET estado_validacion = ?, fecha_validacion = NOW() 
       WHERE id = ?`,
      [estado, id]
    );
    return result;
  }
};
