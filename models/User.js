import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, maxLength: 50, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, maxLength: 50, required: true},
    role: { type: String, default: 'user'},
    avatar: String,
    followCount: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;