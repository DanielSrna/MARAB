import mongoose from 'mongoose';

const ResetPasswordTokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        trim: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 // Expira en 1 hora
    }
}, { timestamps: true });

const ResetPasswordToken = mongoose.model('ResetPasswordToken', ResetPasswordTokenSchema);

export default ResetPasswordToken;
