import User from "../models/user.model.js";
import ResetPasswordToken from "../models/resetPasswordT.schema.js";
import RefreshToken from "../models/refreshT.schema.js";
import { sendResetPasswordEmail } from "../services/mailer.service.js";
import { verifyResetPasswordToken } from "../services/jwt.service.js";

// Solicitar recuperación de contraseña
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        // Verificar que se proporcionó el email
        if (!email) {
            return res.status(400).json({ message: "El email es requerido" });
        }

        // Buscar usuario por email
        const user = await User.findOne({ email });
        
        // Por seguridad, siempre devolver el mismo mensaje
        // aunque el usuario no exista
        if (!user) {
            return res.status(200).json({ 
                message: "Si el email existe, recibirás un correo de recuperación" 
            });
        }

        // Enviar correo de recuperación
        await sendResetPasswordEmail(email);

        res.status(200).json({ 
            message: "Si el email existe, recibirás un correo de recuperación" 
        });
    } catch (error) {
        console.error("Error al solicitar recuperación de contraseña:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Restablecer contraseña
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Validar campos requeridos
        if (!token || !newPassword) {
            return res.status(400).json({ 
                message: "Token y nueva contraseña son requeridos" 
            });
        }

        // Validar longitud de contraseña
        if (newPassword.length < 8) {
            return res.status(400).json({ 
                message: "La contraseña debe tener al menos 8 caracteres" 
            });
        }

        // Verificar el token
        const decoded = await verifyResetPasswordToken(token);

        // Buscar usuario
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Actualizar contraseña (el hash se aplica automáticamente por el pre-save)
        user.password = newPassword;
        await user.save();

        // Eliminar TODOS los refresh tokens del usuario (cierra sesión en todos los dispositivos)
        await RefreshToken.deleteMany({ userId: user._id });

        // Eliminar el token usado
        await ResetPasswordToken.deleteOne({ email: decoded.email });

        res.status(200).json({ 
            message: "Contraseña restablecida exitosamente. Se ha cerrado sesión en todos los dispositivos." 
        });
    } catch (error) {
        console.error("Error al restablecer contraseña:", error);
        
        if (error.message.includes("no válido") || error.message.includes("no encontrado")) {
            return res.status(400).json({ message: "Token inválido o expirado" });
        }
        
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
