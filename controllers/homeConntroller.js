const Song = require('../models/Song');
const Playlist = require('../models/Playlist');
const Artist = require('../models/Artist');

const getHome = async function(req, rep){
    const songs = await Song.find().limit(5).populate('artist', 'name');
    const playlists = await Playlist.find().limit(5);
    const artists = await Artist.find().limit(5);

    return rep.view('home.pug', {
        songs,
        playlists,
        artists,
        user: req.user || null
    });
}

module.exports = getHome;