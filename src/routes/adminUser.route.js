import {registerUser} from "../controller/register.controller.js";
import {loginUser} from "../controller/login.controller.js";
import {verifyEmail} from "../controller/verifyEmail.controller.js";
import { loginValidator } from "../validators/login/login.validator.js";
import { registerValidator } from "../validators/register/register.validator.js";
import { validateRequest } from "../validators/handler.validator.js";
import express from "express";

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', registerValidator, validateRequest, registerUser);

// Ruta para iniciar sesión
router.post('/login', loginValidator, validateRequest, loginUser);

// Ruta para verificar el email del usuario
router.get('/verify-email', verifyEmail);

export default router;