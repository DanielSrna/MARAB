import { verifyRefreshToken, generateAccessToken } from '../services/jwt.service.js';
import User from '../models/user.model.js';

export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        // Validar que se envió el refresh token
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token es requerido' });
        }

        // Verificar el refresh token
        const decoded = await verifyRefreshToken(refreshToken);

        // Buscar el usuario en la base de datos
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Generar un nuevo access token
        const newAccessToken = generateAccessToken(user);

        res.status(200).json({
            message: 'Access token renovado exitosamente',
            accessToken: newAccessToken
        });
    } catch (error) {
        console.error('Error al renovar el access token:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Refresh token inválido' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Refresh token expirado' });
        }
        
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
