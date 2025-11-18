import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        trim: true,
        minlength: 3, 
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        trim: true,
        minlength: 5, 
        maxlength: 100,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8, 
        maxlength: 1024,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    emailVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default User;