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

    const [result] = await db.execute(
      `INSERT INTO solicitudes 
      (tipo, cliente, direccion, horario, contacto, telefono, referencia, propiedad, activo_fijo, falla, documentacion, diligencia, usuario_id, fecha_creacion) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [tipo, cliente, direccion, horario, contacto, telefono, referencia, propiedad, activo_fijo, falla, documentacion, diligencia, usuario_id]
    );

    return result.insertId;
  },
};
