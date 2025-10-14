import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../services/jwt.service.js";

export const loginUser = async (req, res) => {
    const { email, password, device } = req.body;

    try {
        // Buscar usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Credenciales invalidas" });
        }

        // Verificar contraseña
        const isPasswordValid = (password === user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Credenciales invalidas" });
        }

        // Verificar si el email está verificado
        if (!user.emailVerified) {
            return res.status(403).json({ message: "Email no verificado. Por favor verifica tu email." });
        }

        // Generar tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken({ ...user.toObject(), device });

        res.status(200).json({
            message: "Login exitoso",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                user: user.user,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Error logging user:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};