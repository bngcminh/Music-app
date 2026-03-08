const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    playlistName: { type: String, required: true },
    songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    }
    ],
    coverUrl: String,
    isPublic: Boolean,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ownerRole: {
        type: String,
        enum: ['admin','user']
    }
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);