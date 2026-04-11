const mongoose = require('mongoose');

const userPlaylistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    isPublic: { type: Boolean, default: true },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    coverUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('userPlaylist', userPlaylistSchema);
