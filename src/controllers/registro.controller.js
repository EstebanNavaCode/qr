import { getConnection, sql } from "../../sis/database/conection.js";

export const registrarExpositor = async (req, res) => {
  const { nombre, apellidos, empresa, correo, contrasena } = req.body;

  if (!nombre || !apellidos || !empresa || !correo || !contrasena) {
    return res.status(400).json({ success: false, message: "Faltan campos obligatorios" });
  }

  try {
    const pool = await getConnection();

    // Verificar si el correo ya está registrado
    const existeCorreo = await pool.request()
      .input("CORREO_EXP", sql.VarChar(100), correo)
      .query(`SELECT * FROM EXPOSITORES_T WHERE CORREO_EXP = @CORREO_EXP`);

    if (existeCorreo.recordset.length > 0) {
      return res.status(409).json({ success: false, message: "Este correo ya está registrado ❗" });
    }

    // Insertar nuevo expositor
    await pool.request()
      .input("EMPRESA_EXP", sql.VarChar(100), empresa)
      .input("CORREO_EXP", sql.VarChar(100), correo)
      .input("CONTRA_EXP", sql.VarChar(50), contrasena)
      .input("TIPO_EXP", sql.Int, 1)
      .input("APLICA_DINAMICA_EXP", sql.Int, 0)
      .input("IMPRIMIR_DINAMICA_EXP", sql.Bit, 0)
      .input("FECHA_ALTA_EXP", sql.DateTime, new Date())
      .input("ID_EVE_EXP", sql.Int, 1)
      .input("ACTIVO_EXP", sql.Bit, 1)
      .query(`
        INSERT INTO EXPOSITORES_T 
        (EMPRESA_EXP, CORREO_EXP, CONTRA_EXP, TIPO_EXP, APLICA_DINAMICA_EXP, IMPRIMIR_DINAMICA_EXP, FECHA_ALTA_EXP, ID_EVE_EXP, ACTIVO_EXP)
        VALUES 
        (@EMPRESA_EXP, @CORREO_EXP, @CONTRA_EXP, @TIPO_EXP, @APLICA_DINAMICA_EXP, @IMPRIMIR_DINAMICA_EXP, @FECHA_ALTA_EXP, @ID_EVE_EXP, @ACTIVO_EXP)
      `);

    res.json({ success: true, message: "Registro exitoso ✅" });

  } catch (error) {
    console.error("Error al registrar expositor:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};
