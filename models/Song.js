import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    songName: { type: String, required: true },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
    },
    audioUrl: String,
    songImage: String,
    lyric: String,
    playCount: { type: Number, default: 0 }
}, { timestamps: true });

const Song = mongoose.model('Song', songSchema);
export default Song;