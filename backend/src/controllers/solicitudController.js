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
    // 🔹 Validar que la solicitud esté validada si es de TYS
    const [solicitud] = await db.execute(
      "SELECT fecha_creacion, tipo, propiedad, estado_validacion FROM solicitudes WHERE id = ?",
      [id]
    );

    if (solicitud.length === 0) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    const data = solicitud[0];

    if (
      data.tipo?.toLowerCase().includes("servicio") &&
      data.propiedad?.toLowerCase() === "tys" &&
      data.estado_validacion !== "Validada"
    ) {
      return res.status(400).json({
        message: "❌ No se puede asignar esta solicitud. Debe validarse antes.",
      });
    }

    const fechaCreacion = new Date(data.fecha_creacion);
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
    const [rows] = await db.execute(`
      SELECT 
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
        s.estado_validacion,
        s.fecha_validacion,
        u.nombre AS asesor
      FROM solicitudes s
      LEFT JOIN usuarios u ON s.usuario_id = u.id
      ORDER BY s.fecha_creacion ASC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    res.status(500).json({ message: "Error al obtener solicitudes" });
  }

  
};

export const validarSolicitud = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [solicitud] = await db.execute(
      "SELECT fecha_creacion FROM solicitudes WHERE id = ?",
      [id]
    );

    if (solicitud.length === 0)
      return res.status(404).json({ message: "Solicitud no encontrada" });

    const fechaCreacion = new Date(solicitud[0].fecha_creacion);
    const fechaValidacion = new Date();
    const minutos = Math.floor((fechaValidacion - fechaCreacion) / 60000);

    // Actualiza la solicitud
    await db.execute(
      "UPDATE solicitudes SET estado_validacion = 'Validada', fecha_validacion = ? WHERE id = ?",
      [fechaValidacion, id]
    );

    // Guarda en historial
    await db.execute(
      "INSERT INTO historial_validaciones (solicitud_id, usuario_validador, fecha_validacion, tiempo_transcurrido) VALUES (?, ?, ?, ?)",
      [id, userId, fechaValidacion, minutos]
    );

    res.json({
      message: "Solicitud validada correctamente",
      tiempo_transcurrido: minutos,
      fecha_validacion: fechaValidacion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al validar solicitud" });
  }
};
// Obtener solicitudes del asesor logueado
export const listarPorAsesor = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const [rows] = await db.execute(
      "SELECT * FROM solicitudes WHERE usuario_id = ? ORDER BY fecha_creacion DESC",
      [usuario_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener solicitudes del asesor" });
  }
};

// Editar solicitud y guardar historial
export const editarSolicitud = async (req, res) => {
  const { id } = req.params;
  const cambios = req.body;
  const usuario_id = req.user.id;

  try {
    const [actual] = await db.execute("SELECT * FROM solicitudes WHERE id = ?", [id]);
    if (actual.length === 0) return res.status(404).json({ message: "Solicitud no encontrada" });
    const anterior = actual[0];

    // Evitar edición si ya está validada o asignada
    if (anterior.estado_validacion === "Validada" || anterior.estado === "Asignada") {
      return res.status(400).json({ message: "No se puede modificar una solicitud ya validada o asignada" });
    }

    // Actualizar campos dinámicamente
    const campos = Object.keys(cambios);
    for (const campo of campos) {
      if (anterior[campo] != cambios[campo]) {
        await db.execute(
          "INSERT INTO historial_modificaciones (solicitud_id, usuario_id, campo_modificado, valor_anterior, valor_nuevo) VALUES (?,?,?,?,?)",
          [id, usuario_id, campo, anterior[campo], cambios[campo]]
        );
      }
    }

    const setClause = campos.map(c => `${c} = ?`).join(", ");
    const values = [...campos.map(c => cambios[c]), id];
    await db.execute(`UPDATE solicitudes SET ${setClause} WHERE id = ?`, values);

    res.json({ message: "Solicitud modificada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al modificar solicitud" });
  }
};

export const detalleSolicitud = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(`
      SELECT 
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
        s.estado_validacion,
        s.fecha_validacion,
        s.estado_final,
        s.fecha_archivo,
        u.nombre AS creado_por
      FROM solicitudes s
      JOIN usuarios u ON u.id = s.usuario_id
      WHERE s.id = ?
    `, [id]);

    if (!rows.length) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error en detalleSolicitud:", error);
    res.status(500).json({ message: "Error al obtener detalle" });
  }
};

export const reprogramarSolicitud = async (req, res) => {
  const { id } = req.params;
  const usuario_id = req.user.id;
  const { comentario } = req.body;

  try {
    await db.execute(`
      UPDATE solicitudes SET 
      estado = 'Pendiente',
      estado_final = 'Reprogramada',
      operativo_asignado = NULL,
      fecha_asignacion = NULL
      WHERE id = ?
    `, [id]);

    await db.execute(`
      INSERT INTO historial_movimientos (solicitud_id, usuario_id, accion, comentario)
      VALUES (?, ?, 'Reprogramada', ?)
    `, [id, usuario_id, comentario]);

    res.json({ message: "Solicitud reprogramada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al reprogramar" });
  }
};
export const archivarSolicitud = async (req, res) => {
  const { id } = req.params;
  const usuario_id = req.user.id;

  try {
    await db.execute(`
      UPDATE solicitudes SET 
      estado_final = 'Archivada',
      fecha_archivo = NOW()
      WHERE id = ?
    `, [id]);

    await db.execute(`
      INSERT INTO historial_movimientos (solicitud_id, usuario_id, accion)
      VALUES (?, ?, 'Archivada')
    `, [id, usuario_id]);

    res.json({ message: "Solicitud archivada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al archivar" });
  }
};





