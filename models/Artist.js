const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: { type: String, require: true, unique: true },
    avatar: String,
    bio: String,
}, { timestamps: true });

module.exports = mongoose.model('Artists', artistSchema);