import mongoose from "mongoose";

const userPlaylistSchema = new mongoose.Schema({
    playlistName: { type: String, require: true },
    playlistImage: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    description: { type: String, default: '' },
    isPublic: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
