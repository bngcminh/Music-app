import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    title: { type: String, required: true, maxlength: 100 },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
    },
    albumImage: { type: String, default: '' },
    description: { type: String, maxlength: 1000 },
    releaseDate: { type: Date },
    isPublic: {
        type: Boolean,
        default: true
    },
    totalSongs: { type: Number, default: 0 },
})

const Album = mongoose.model('Album', albumSchema);
export default Artist;