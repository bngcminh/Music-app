import mongoose from "mongoose";

const favoriteSongSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    songs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
        required: true
    }
}, { timestamps: true })

const favoriteSong = mongoose.model('favoriteSong', favoriteSongSchema);
export default favoriteSong;