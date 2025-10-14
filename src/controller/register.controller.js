import User from "../models/user.model.js";
import { sendVerificationEmail } from "../services/mailer.service.js";

export const registerUser = async (req, res) => {
    const { user, email, password } = req.body;

    try {
        // Verificar si el usuario o email ya existen
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Credenciales invalidas" });
        }

        // Crear nuevo usuario
        const newUser = new User({ user, email, password });
        await newUser.save();

        // Enviar correo de verificación
        await sendVerificationEmail(newUser);

        res.status(201).json({ message: "Usuario registrado exitosamente. Por favor verifica tu email." });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};