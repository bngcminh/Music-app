import mongoose from "mongoose";

const artistFollowSchema = new mongoose.Schema({
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
    },
    users:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

const artistFollow = mongoose.model('artistFollow', artistFollowSchema);
export default artistFollow;