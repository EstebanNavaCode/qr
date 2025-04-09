import { getConnection, sql } from "../../sis/database/conection.js";

export const registrarEscaneo = async (req, res) => {
  const { expositor_id, usuario_id, evento_id } = req.body;

  if (!expositor_id || !usuario_id || !evento_id) {
    return res.status(400).json({ success: false, message: "Faltan datos necesarios" });
  }

  try {
    const pool = await getConnection();

    await pool.request()
      .input("ID_EXP_EXR", sql.Int, expositor_id)
      .input("ID_EVE_EXR", sql.Int, evento_id)
      .input("ID_RC_EXR", sql.Int, usuario_id)
      .query(`
        INSERT INTO EXPOSITORES_REGISTROS_T (ID_EXP_EXR, ID_EVE_EXR, ID_RC_EXR, FECHA_ALTA_EXR, ACTIVO_EXR)
        VALUES (@ID_EXP_EXR, @ID_EVE_EXR, @ID_RC_EXR, GETDATE(), 1)
      `);

    res.json({ success: true, message: "Escaneo registrado correctamente ✅" });
  } catch (error) {
    console.error("Error al registrar escaneo:", error);
    res.status(500).json({ success: false, message: "Error al registrar el escaneo" });
  }
};

export const obtenerEscaneados = async (req, res) => {
  const { expositor_id } = req.params;

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("expositor_id", sql.Int, expositor_id)
      .query(`
        SELECT u.ID, u.NOMBRE, u.APELLIDO, u.EMPRESA, u.CORREO, u.TELEFONO
        FROM EXPOSITORES_REGISTROS_T r
        JOIN USUARIO u ON u.ID = r.ID_RC_EXR
        WHERE r.ID_EXP_EXR = @expositor_id
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener escaneados:", error);
    res.status(500).json({ success: false, message: "Error al obtener los registros" });
  }
};

  