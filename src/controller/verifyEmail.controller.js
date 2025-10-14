import VerificationToken from "../models/verifyT.schema.js";
import { verifyVerificationToken } from "../services/jwt.service.js";
import User from "../models/user.model.js";

export const verifyEmail = async (req, res) => {
    const { token } = req.query;
    
    if (!token) {
        return res.status(400).json({ message: "Token no proporcionado" });
    }
    
    try {
        const decoded = await verifyVerificationToken(token);
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        user.emailVerified = true;
        await user.save();


        await VerificationToken.deleteOne({ email: decoded.email });

        res.status(200).json({ message: "Correo electrónico verificado con éxito" });
    } catch (error) {
        console.error("Error al verificar el correo electrónico:", error);
        res.status(400).json({ message: "Token inválido o expirado" });
    }
};