import { getConnection, sql } from "../../sis/database/conection.js";

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("CORREO_EXP", sql.VarChar, username)
      .input("CONTRA_EXP", sql.VarChar, password).query(`
      SELECT ID_EXP, EMPRESA_EXP, CORREO_EXP, CONTRA_EXP
      FROM EXPOSITORES_T 
      WHERE CORREO_EXP = @CORREO_EXP AND CONTRA_EXP = @CONTRA_EXP
  `);

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      res.json({ success: true, user });
    } else {
      res.json({
        success: false,
        message: "Correo o contraseña incorrectos ❌",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};
