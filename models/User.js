const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, require: true},
    email: { type: String, require: true},
    password: { type: String, require: true, unique: true},
    role: { type: String, default: 'user'},
    avartar: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;