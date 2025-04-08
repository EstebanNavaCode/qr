import  { Router } from "express";
import { loginUser } from "../../src/controllers/login.controller.js";
import { registrarIntercambio, obtenerContactos } from "../../src/controllers/intercambio.controller.js";

const router = Router();

router.post("/login", loginUser);
router.post("/registrar-intercambio", registrarIntercambio);
router.get("/mis-contactos/:usuario_id", obtenerContactos);

export default router;