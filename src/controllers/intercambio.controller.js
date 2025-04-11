import { getConnection, sql } from "../../sis/database/conection.js";

export const registrarEscaneo = async (req, res) => {
  const { expositor_id, usuario_id, evento_id } = req.body;

  if (!expositor_id || !usuario_id || !evento_id) {
    return res.status(400).json({ success: false, message: "Faltan datos necesarios" });
  }

  try {
    const pool = await getConnection();

    // Verificar si el usuario escaneado existe
    const usuarioExiste = await pool.request()
      .input("usuario_id", sql.Int, usuario_id)
      .query("SELECT ID FROM USUARIO WHERE ID = @usuario_id");

    if (usuarioExiste.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "El usuario escaneado no existe" });
    }

    //  Verificar si ya se registró ese intercambio antes
    const existe = await pool.request()
      .input("ID_EXP_EXR", sql.Int, expositor_id)
      .input("ID_EVE_EXR", sql.Int, evento_id)
      .input("ID_RC_EXR", sql.Int, usuario_id)
      .query(`
        SELECT * FROM EXPOSITORES_REGISTROS_T
        WHERE ID_EXP_EXR = @ID_EXP_EXR AND ID_EVE_EXR = @ID_EVE_EXR AND ID_RC_EXR = @ID_RC_EXR
      `);

    if (existe.recordset.length > 0) {
      return res.json({ success: false, message: "Este usuario ya fue escaneado anteriormente" });
    }

    // ✅ Insertar el registro del escaneo
    await pool.request()
      .input("ID_EXP_EXR", sql.Int, expositor_id)
      .input("ID_EVE_EXR", sql.Int, evento_id)
      .input("ID_RC_EXR", sql.Int, usuario_id)
      .query(`
        INSERT INTO EXPOSITORES_REGISTROS_T (ID_EXP_EXR, ID_EVE_EXR, ID_RC_EXR, FECHA_ALTA_EXR, ACTIVO_EXR)
        VALUES (@ID_EXP_EXR, @ID_EVE_EXR, @ID_RC_EXR, GETDATE(), 1)
      `);

    res.json({ success: true, message: "Escaneo registrado correctamente" });

  } catch (error) {
    console.error("❌ Error al registrar escaneo:", error);
    res.status(500).json({ success: false, message: "Error al registrar el escaneo" });
  }
};


export const obtenerUltimosEscaneados = async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("usuario_id", sql.Int, usuario_id)
      .query(`
        SELECT TOP 5 u.ID, u.NOMBRE, u.APELLIDO, u.EMPRESA, u.CORREO, u.TELEFONO, u.ESTADO, u.CIUDAD
        FROM EXPOSITORES_REGISTROS_T r
        JOIN USUARIO u ON u.ID = r.ID_RC_EXR
        WHERE r.ID_EXP_EXR = @usuario_id
        ORDER BY r.FECHA_ALTA_EXR DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener escaneados:", error);
    res.status(500).json({ success: false, message: "Error al obtener los registros" });
  }
};


export const obtenerEscaneados = async (req, res) => {
  const { usuario_id } = req.params; 

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("usuario_id", sql.Int, usuario_id)
      .query(`
        SELECT u.ID, u.NOMBRE, u.APELLIDO, u.EMPRESA, u.CORREO, u.TELEFONO, u.ESTADO, u.CIUDAD
        FROM EXPOSITORES_REGISTROS_T r
        JOIN USUARIO u ON u.ID = r.ID_RC_EXR
        WHERE r.ID_EXP_EXR = @usuario_id
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener escaneados:", error);
    res.status(500).json({ success: false, message: "Error al obtener los registros" });
  }
};

  