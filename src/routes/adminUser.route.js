import {registerUser} from "../controller/register.controller.js";
import {loginUser} from "../controller/login.controller.js";
import {logoutUser} from "../controller/logout.controller.js";
import {verifyEmail} from "../controller/verifyEmail.controller.js";
import {refreshAccessToken} from "../controller/refreshToken.controller.js";
import {requestPasswordReset, resetPassword} from "../controller/resetPassword.controller.js";
import { loginValidator } from "../validators/login/login.validator.js";
import { registerValidator } from "../validators/register/register.validator.js";
import { validateRequest } from "../validators/handler.validator.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

// Rutas públicas de autenticación
// Ruta para registrar un nuevo usuario
router.post('/register', registerValidator, validateRequest, registerUser);

// Ruta para iniciar sesión
router.post('/login', loginValidator, validateRequest, loginUser);

// Ruta para verificar el email del usuario
router.get('/verify-email', verifyEmail);

// Ruta para solicitar recuperación de contraseña
router.post('/request-password-reset', requestPasswordReset);

// Ruta para restablecer la contraseña
router.post('/reset-password', resetPassword);

// Rutas que requieren autenticación
// Ruta para refrescar el access token
router.post('/refresh-token', refreshAccessToken);

// Ruta para cerrar sesión
router.post('/logout', authenticate, logoutUser);

// Ruta de ejemplo protegida (solo usuarios autenticados)
router.get('/profile', authenticate, (req, res) => {
    res.status(200).json({ 
        message: "Perfil de usuario", 
        user: req.user 
    });
});

// Ruta de ejemplo solo para admins
router.get('/admin/users', authenticate, authorize('admin'), (req, res) => {
    res.status(200).json({ 
        message: "Lista de usuarios (solo admin)" 
    });
});

export default router;