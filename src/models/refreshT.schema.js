import mongoose from 'mongoose';

const RefreshTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "register",
        required: true
        },
        device: {
            type: String,
            required: true
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);

export default RefreshToken;