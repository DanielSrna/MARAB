import { verifyRefreshToken } from '../services/jwt.service.js';
import RefreshToken from '../models/refreshT.schema.js';

export const logoutUser = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        // Validar que se envió el refresh token
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token es requerido' });
        }

        // Verificar el refresh token
        const decoded = await verifyRefreshToken(refreshToken);

        // Eliminar el refresh token de la base de datos (buscar por userId)
        const result = await RefreshToken.deleteOne({ 
            userId: decoded.userId
        });

        // Verificar si se eliminó algún token
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Token no encontrado o ya fue eliminado' });
        }

        res.status(200).json({ message: 'Logout exitoso' });
    } catch (error) {
        console.error('Error during logout:', error);
        
        // Distinguir entre diferentes tipos de errores
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado' });
        }
        
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};