import { body } from 'express-validator';

export const loginValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Dirección de correo electrónico no válida')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial'),
  body('device')
    .trim()
    .notEmpty()
    .withMessage('Información del dispositivo requerida')
];