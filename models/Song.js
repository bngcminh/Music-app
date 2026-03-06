const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    songName: { type: String, require: true },
    artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
    },
    audioUrl: String,
    coverUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);