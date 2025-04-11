import  { Router } from "express";
import { loginUser } from "../../src/controllers/login.controller.js";
import { registrarEscaneo, obtenerEscaneados } from "../../src/controllers/intercambio.controller.js";
import { registrarExpositor } from "../../src/controllers/registro.controller.js";

const router = Router();

router.post("/login", loginUser);
router.post("/registrar-intercambio", registrarEscaneo);
router.get("/mis-contactos/:usuario_id", obtenerEscaneados);
router.post("/register", registrarExpositor)

export default router;