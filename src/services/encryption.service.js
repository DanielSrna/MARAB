import crypto from 'crypto';

// Algoritmo de encriptación
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // Para AES, esto es 16 bytes
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

/**
 * Deriva una clave a partir de la clave secreta y el salt
 */
const getKey = (salt) => {
    return crypto.pbkdf2Sync(
        process.env.ENCRYPTION_SECRET,
        salt,
        100000,
        32,
        'sha512'
    );
};

/**
 * Encripta un texto
 * @param {string} text - Texto a encriptar
 * @returns {string} Texto encriptado en formato hexadecimal
 */
export const encrypt = (text) => {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const salt = crypto.randomBytes(SALT_LENGTH);
        const key = getKey(salt);

        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        const encrypted = Buffer.concat([
            cipher.update(text, 'utf8'),
            cipher.final()
        ]);

        const tag = cipher.getAuthTag();

        // Combina salt + iv + tag + encrypted
        return Buffer.concat([salt, iv, tag, encrypted]).toString('hex');
    } catch (error) {
        console.error("Error al encriptar:", error);
        throw new Error("Error en la encriptación");
    }
};

/**
 * Desencripta un texto
 * @param {string} encryptedText - Texto encriptado en formato hexadecimal
 * @returns {string} Texto desencriptado
 */
export const decrypt = (encryptedText) => {
    try {
        const stringValue = Buffer.from(encryptedText, 'hex');

        const salt = stringValue.slice(0, SALT_LENGTH);
        const iv = stringValue.slice(SALT_LENGTH, TAG_POSITION);
        const tag = stringValue.slice(TAG_POSITION, ENCRYPTED_POSITION);
        const encrypted = stringValue.slice(ENCRYPTED_POSITION);

        const key = getKey(salt);

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);

        return decipher.update(encrypted) + decipher.final('utf8');
    } catch (error) {
        console.error("Error al desencriptar:", error);
        throw new Error("Error en la desencriptación");
    }
};
