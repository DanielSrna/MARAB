import RefreshToken from "../models/refreshT.schema.js";
import VerificationToken from "../models/verifyT.schema.js";
import ResetPasswordToken from "../models/resetPasswordT.schema.js";
import jwt from 'jsonwebtoken';
import { encrypt, decrypt } from './encryption.service.js';

// Generación de Access Token
export const generateAccessToken = (payload) => {
    return jwt.sign(
        { id: payload._id, email: payload.email }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    );
};

// Generación de Refresh Token
export const generateRefreshToken = async (payload) => {
    try {
        const newRefreshToken = jwt.sign(
            { id: payload._id, email: payload.email }, 
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
        );

        // Encriptar el token antes de guardarlo
        const encryptedToken = encrypt(newRefreshToken);

        await RefreshToken.findOneAndUpdate(
            { userId: payload._id, device: payload.device },
            { refreshToken: encryptedToken },
            { upsert: true, new: true }
        );
        
        return newRefreshToken;
    } catch (error) {
        console.error("Error al generar el refresh token:", error);
        throw error;
    }
};

// Generación de Verification Token
export const generateVerificationToken = async (payload) => {
    try {
        const verificationToken = jwt.sign(
            { email: payload.email }, 
            process.env.VERIFICATION_TOKEN_SECRET, 
            { expiresIn: process.env.VERIFICATION_TOKEN_EXPIRATION }
        );

        // Encriptar el token antes de guardarlo
        const encryptedToken = encrypt(verificationToken);

        await VerificationToken.findOneAndUpdate(
            { email: payload.email },
            { token: encryptedToken },
            { upsert: true, new: true }
        );

        return verificationToken;
    } catch (error) {
        console.error("Error al generar el verification token:", error);
        throw error;
    }
};

// Generación de Reset Password Token
export const generateResetPasswordToken = async (payload) => {
    try {
        const resetToken = jwt.sign(
            { email: payload.email }, 
            process.env.RESET_PASSWORD_TOKEN_SECRET, 
            { expiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRATION }
        );

        // Encriptar el token antes de guardarlo
        const encryptedToken = encrypt(resetToken);

        await ResetPasswordToken.findOneAndUpdate(
            { email: payload.email },
            { token: encryptedToken },
            { upsert: true, new: true }
        );

        return resetToken;
    } catch (error) {
        console.error("Error al generar el reset password token:", error);
        throw error;
    }
};

// Verificación de Access Token
export const verifyAccessToken = (accessToken) => {
    try {
        const decoded = jwt.verify(
            accessToken, 
            process.env.ACCESS_TOKEN_SECRET
        );
        return {
            message: "Access token válido",
            userId: decoded.id,
            email: decoded.email
        };
    } catch (error) {
        console.error("Error al verificar el access token:", error);
        throw error;
    }
};

// Verificación de Refresh Token
export const verifyRefreshToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(
            refreshToken, 
            process.env.REFRESH_TOKEN_SECRET
        );

        // Buscar el documento del usuario en la BD
        const storedTokenDoc = await RefreshToken.findOne({ userId: decoded.id });
        if (!storedTokenDoc) {
            throw new Error("Refresh token no válido o no encontrado");
        }

        // Desencriptar el token almacenado y compararlo
        const decryptedStoredToken = decrypt(storedTokenDoc.refreshToken);
        if (decryptedStoredToken !== refreshToken) {
            throw new Error("Refresh token no coincide");
        }

        return {
            message: "Refresh token válido",
            userId: decoded.id,
            email: decoded.email
        };
    } catch (error) {
        console.error("Error al verificar el refresh token:", error);
        throw error;
    }
};

// Verificación de Verification Token
export const verifyVerificationToken = async (verificationToken) => {
    try {
        console.log("1. Verificando JWT...");
        const decoded = jwt.verify(
            verificationToken, 
            process.env.VERIFICATION_TOKEN_SECRET
        );
        console.log("2. JWT válido, email:", decoded.email);

        // Buscar el token encriptado en la BD por email
        console.log("3. Buscando token en BD por email...");
        const storedTokenDoc = await VerificationToken.findOne({ email: decoded.email });
        console.log("4. Documento encontrado en BD:", !!storedTokenDoc);
        
        if (!storedTokenDoc) {
            throw new Error("Verification token no válido o no encontrado");
        }

        // Desencriptar el token almacenado y compararlo
        console.log("5. Desencriptando token almacenado...");
        const decryptedStoredToken = decrypt(storedTokenDoc.token);
        console.log("6. Comparando tokens...");
        
        if (decryptedStoredToken !== verificationToken) {
            throw new Error("Verification token no coincide");
        }

        console.log("7. Token válido!");
        return {
            message: "Verification token válido",
            email: decoded.email
        };
    } catch (error) {
        console.error("Error al verificar el verification token:", error);
        throw error;
    }
};

// Verificación de Reset Password Token
export const verifyResetPasswordToken = async (resetToken) => {
    try {
        const decoded = jwt.verify(
            resetToken, 
            process.env.RESET_PASSWORD_TOKEN_SECRET
        );

        // Buscar el token en la BD por email
        const storedTokenDoc = await ResetPasswordToken.findOne({ email: decoded.email });
        if (!storedTokenDoc) {
            throw new Error("Reset password token no válido o no encontrado");
        }

        // Desencriptar el token almacenado y compararlo
        const decryptedStoredToken = decrypt(storedTokenDoc.token);
        if (decryptedStoredToken !== resetToken) {
            throw new Error("Reset password token no coincide");
        }

        return {
            message: "Reset password token válido",
            email: decoded.email
        };
    } catch (error) {
        console.error("Error al verificar el reset password token:", error);
        throw error;
    }
};
