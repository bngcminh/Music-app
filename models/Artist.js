import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
    nameArtist: { type: String, required: true, unique: true },
    avatarArtist: String,
    bio: String,
    followCount: { type: Number, default: 0 }
}, { timestamps: true });

const Artist = mongoose.model('Artist', artistSchema);
export default Artist;