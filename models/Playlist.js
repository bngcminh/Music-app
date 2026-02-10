const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    playlistName: { type: String, require: true },
    songs: [ObjectId],
    coverUrl: String,
    isPublic: Boolean,
    totalSongs: Number,
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);