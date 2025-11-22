//Servicio de mensajería para confirmar email con nodemailer

import nodemailer from 'nodemailer';
import { generateVerificationToken, generateResetPasswordToken } from './jwt.service.js';

//Configuración del transporter de nodemailer
const getTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        port: Number(process.env.MAILER_PORT),
        secure: false,
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASS,
        },
    });
};

export const sendVerificationEmail = async (user) => {
    let token;
    let verificationLink;
    try {
        token = await generateVerificationToken({ email: user.email });
        // Usar la URL del backend para el endpoint de verificación
        const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;
        verificationLink = `${backendUrl}/api/auth/verify-email?token=${token}`;
    } catch (error) {
        console.error("Error al generar el token de verificación:", error);
        throw error;
    }

    const mailOptions = {
        from: "no-reply@marab.com",
        to: user.email,
        subject: 'Por favor verifica tu correo electrónico',
        html: `
            <h1>Email de verificación</h1>
            <p>Clic en el siguiente enlace para verificar tu dirección de correo electrónico:</p>
            <a href="${verificationLink}">Verificar Email</a>
            <p>Este enlace expirará en 24 horas.</p>
        `,
    };

    try {
        const transporter = getTransporter();
        await transporter.sendMail(mailOptions);
        console.log(`Correo de verificación enviado a ${user.email}`);
    } catch (error) {
        console.error("Error al enviar el correo de verificación:", error);
        throw error;
    }
};

export const sendResetPasswordEmail = async (email) => {
    let token;
    try {
        token = await generateResetPasswordToken({ email });
    } catch (error) {
        console.error("Error al generar el token de recuperación:", error);
        throw error;
    }

    // Link al frontend si existe y no está vacío, sino solo mostrar el token
    const frontendResetLink = process.env.FRONTEND_URL && process.env.FRONTEND_URL.trim() !== ''
        ? `${process.env.FRONTEND_URL}/reset-password?token=${token}`
        : null;

    const mailOptions = {
        from: "no-reply@marab.com",
        to: email,
        subject: 'Recuperación de contraseña',
        html: `
            <h1>Recuperación de contraseña</h1>
            <p>Has solicitado restablecer tu contraseña.</p>
            ${frontendResetLink 
                ? `<p><a href="${frontendResetLink}">Haz clic aquí para restablecer tu contraseña</a></p>`
                : `<p><strong>Token de recuperación:</strong></p>
                   <p style="background:#f4f4f4;padding:10px;word-break:break-all;font-family:monospace;">${token}</p>
                   <p>Para restablecer tu contraseña, envía una petición POST a:</p>
                   <p><code>POST ${process.env.BACKEND_URL}/api/auth/reset-password</code></p>
                   <p>Con el siguiente body:</p>
                   <pre style="background:#f4f4f4;padding:10px;">
{
  "token": "el_token_de_arriba",
  "newPassword": "tu_nueva_contraseña"
}</pre>`
            }
            <p>Este token expirará en 1 hora.</p>
            <p>Si no solicitaste este cambio, ignora este correo.</p>
        `,
    };

    try {
        const transporter = getTransporter();
        await transporter.sendMail(mailOptions);
        console.log(`Correo de recuperación enviado a ${email}`);
    } catch (error) {
        console.error("Error al enviar el correo de recuperación:", error);
        throw error;
    }
};
