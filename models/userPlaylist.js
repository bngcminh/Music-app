import mongoose from "mongoose";

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

const User = mongoose.model('User', userSchema);
export default User;
