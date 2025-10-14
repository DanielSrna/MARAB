import { body } from 'express-validator';

export const registerValidator = [
    body('user')
    .trim()
    .isString()
    .escape()
    .withMessage('El nombre de usuario debe ser una cadena de texto')
    .isLength({ min: 3, max: 100 })
    .withMessage('El nombre de usuario debe tener entre 3 y 100 caracteres')
    .matches(/^[a-zA-Z0-9 ]+$/)
    .withMessage('El nombre de usuario solo puede contener letras, números y espacios'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Dirección de correo electrónico no válida'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Las contraseñas no coinciden')
];