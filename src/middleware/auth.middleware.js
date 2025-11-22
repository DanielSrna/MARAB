import { verifyAccessToken } from '../services/jwt.service.js';

// Middleware para proteger rutas que requieren autenticación
export const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
};

// Middleware para verificar roles específicos
export const authorize = (...roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        // Importar dinámicamente para evitar dependencias circulares
        const User = (await import('../models/user.model.js')).default;
        
        try {
            const user = await User.findOne({ email: req.user.email });
            
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            if (!roles.includes(user.role)) {
                return res.status(403).json({ 
                    message: 'No tienes permisos para acceder a este recurso' 
                });
            }

            next();
        } catch (error) {
            console.error('Error en autorización:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    };
};
