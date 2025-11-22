import { verifyRefreshToken, generateAccessToken } from '../services/jwt.service.js';
import User from '../models/user.model.js';

export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        // Validar que se envió el refresh token
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token es requerido' });
        }

        console.log('1. Verificando refresh token...');
        // Verificar el refresh token
        const decoded = await verifyRefreshToken(refreshToken);
        console.log('2. Refresh token válido, userId:', decoded.userId);

        // Buscar el usuario en la base de datos
        console.log('3. Buscando usuario en BD...');
        const user = await User.findById(decoded.userId);
        if (!user) {
            console.log('4. Usuario NO encontrado');
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        console.log('4. Usuario encontrado:', user.email);

        // Generar un nuevo access token
        console.log('5. Generando nuevo access token...');
        const newAccessToken = generateAccessToken(user);
        console.log('6. Access token generado exitosamente');

        res.status(200).json({
            message: 'Access token renovado exitosamente',
            accessToken: newAccessToken
        });
    } catch (error) {
        console.error('Error al renovar el access token:', error);
        console.error('Tipo de error:', error.name);
        console.error('Mensaje:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Refresh token inválido' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Refresh token expirado' });
        }
        
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
