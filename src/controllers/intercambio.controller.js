import { getConnection, sql } from "../../sis/database/conection.js";

export const registrarIntercambio = async (req, res) => {
  const { remitente_id, destinatario_id } = req.body;

  if (!remitente_id || !destinatario_id) {
    return res.status(400).json({ success: false, message: "Faltan datos necesarios" });
  }

  try {
    const pool = await getConnection();

    await pool.request()
      .input("remitente_id", sql.Int, remitente_id)
      .input("destinatario_id", sql.Int, destinatario_id)
      .query(`
        INSERT INTO intercambios (usuario_remitente_id, usuario_destinatario_id)
        VALUES (@remitente_id, @destinatario_id)
      `);

    res.json({ success: true, message: "Intercambio registrado correctamente ✅" });
  } catch (error) {
    console.error("Error al registrar el intercambio:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

export const obtenerContactos = async (req, res) => {
    const { usuario_id } = req.params;
  
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input("usuario_id", sql.Int, usuario_id)
        .query(`
          SELECT 
            u.id, u.nombre, u.apellido, u.empresa, u.correo, u.telefono
          FROM intercambios i
          JOIN usuario u ON u.id = 
            CASE 
              WHEN i.usuario_remitente_id = @usuario_id THEN i.usuario_destinatario_id
              ELSE i.usuario_remitente_id
            END
          WHERE i.usuario_remitente_id = @usuario_id OR i.usuario_destinatario_id = @usuario_id
        `);
  
      res.json(result.recordset);
    } catch (error) {
      console.error("Error al obtener contactos:", error);
      res.status(500).json({ success: false, message: "Error al obtener contactos" });
    }
  };
  