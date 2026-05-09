import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    playlistName: { type: String, required: true },
    songs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    }],
    playlistImage: String,
    description: { type: String, default: '' },
    isPublic: { Boolean, defautl: true },
}, { timestamps: true });

const Playlist = mongoose.model('Playlist', playlistSchema);
export default Playlist;