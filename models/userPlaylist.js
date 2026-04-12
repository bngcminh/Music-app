const mongoose = require('mongoose');

const userPlaylistSchema = new mongoose.Schema({
    playlistName: String,
    coverUrl: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }]
}, { timestamps: true });

module.exports = mongoose.model('userPlaylist', userPlaylistSchema);
