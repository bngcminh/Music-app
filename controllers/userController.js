const User = require('../models/User');
const UserPlaylist = require('../models/userPlaylist');
const fs = require('node:fs');
const path = require('node:path');
const { pipeline } = require('node:stream/promises');
const bcrypt = require('bcryptjs');
const userPlaylist = require('../models/userPlaylist');

const getProfile = async function(req, rep){
    const infor = await User.findById(userId);
    const playlist = await userPlaylist.find();

    return rep.view('profile.pug',{
        infor,
        playlist,
        user: req.user || null
    })
}

module.exports = {
    getProfile
};
