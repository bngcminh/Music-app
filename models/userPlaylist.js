const mongoose = require('mongoose');

const userPlaylistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    playlistName: String,
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    coverUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('userPlaylist', userPlaylistSchema);
