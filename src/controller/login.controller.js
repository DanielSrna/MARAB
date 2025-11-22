import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../services/jwt.service.js";

export const loginUser = async (req, res) => {
    const { email, password, device } = req.body;

    try {
        console.log("1. Buscando usuario con email:", email);
        // Buscar usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("2. Usuario NO encontrado");
            return res.status(400).json({ message: "Credenciales invalidas" });
        }
        console.log("2. Usuario encontrado:", user.email);

        // Verificar contraseña
        console.log("3. Verificando contraseña...");
        console.log("   - Contraseña recibida:", password);
        console.log("   - Hash en BD:", user.password);
        const isPasswordValid = await user.comparePassword(password);
        console.log("4. Contraseña válida:", isPasswordValid);
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
            refreshToken
        });
    } catch (error) {
        console.error("Error logging user:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};