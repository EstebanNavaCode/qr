import { getConnection, sql } from "../../sis/database/conection.js";

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('email', sql.VarChar, username)
        .input('password', sql.VarChar, password)
        .query(`
            SELECT id, nombre, apellido, telefono, correo, contrasena,empresa 
            FROM usuario 
            WHERE correo = @email AND contrasena = @password
          `);
          
  
      if (result.recordset.length > 0) {
        const user = result.recordset[0];
        res.json({ success: true, user });
      } else {
        res.json({ success: false, message: 'Correo o contraseña incorrectos ❌' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error en el servidor' });

    }
  };
  