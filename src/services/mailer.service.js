//Servicio de mensajería para confirmar email con nodemailer

import nodemailer from 'nodemailer';
import { generateVerificationToken } from './jwt.service.js';

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
        verificationLink = `${process.env.FRONTEND_URL}/api/auth/verify-email?token=${token}`;
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
