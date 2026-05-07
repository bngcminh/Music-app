import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    songName: { type: String, required: true },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist'
    },
    audioUrl: String,
    coverUrl: String,
}, { timestamps: true });

const Song = mongoose.model('Song', songSchema);
export default Song;