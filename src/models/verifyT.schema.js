import mongoose from 'mongoose';

const VerificationTokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        trim: true,
        minlength: 5,
        maxlength: 100
    },
    token: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

const VerificationToken = mongoose.model('VerificationToken', VerificationTokenSchema);

export default VerificationToken;