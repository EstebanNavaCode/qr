import  { Router } from "express";
import { loginUser } from "../../src/controllers/login.controller.js";
import { registrarEscaneo, obtenerEscaneados, obtenerUltimosEscaneados } from "../../src/controllers/intercambio.controller.js";
import { registrarExpositor } from "../../src/controllers/registro.controller.js";

const router = Router();

router.post("/login", loginUser);
router.post("/registrar-intercambio", registrarEscaneo);
router.get("/mis-contactos/:usuario_id", obtenerUltimosEscaneados);
router.post("/register", registrarExpositor)
router.get("/contacs/:usuario_id", obtenerEscaneados)

export default router;