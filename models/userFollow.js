import mongoose from "mongoose";

const userFollow = new mongoose.Schema({
    followers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    following:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

const userFollow = mongoose.Schema('userFollow', userFollow);
export default userFollow;