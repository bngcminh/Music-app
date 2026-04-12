const User = require('../models/User');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');
const userPlaylist = require('../models/userPlaylist');
const Artist = require('../models/Artist');

const getHome = async function(req, rep){
    const songs = await Song.find().limit(5).populate('artist', 'name');
    const playlists = await Playlist.find().limit(5);
    const artists = await Artist.find().limit(5);
    console.log({
        songs,
        playlists,
        artists
    })
    return rep.view('home.pug', {
        songs,
        playlists,
        artists,
        user: req.user || null
    });
}

const getProfile = async function(req, rep){
    const infor = await User.findById(req.user.id);
    const playlist = await userPlaylist.findById(req.user.id);
    
    return rep.view('profile.pug',{
        infor,
        playlist,
        user: req.user || null
    });
}

const getArtist = async function(req, rep){
    const artistId = req.params.artistId;
    const artist = await Artist.findById(artistId);
    const songs = await Song.find({artist: artistId}).select('songName artist').limit(10);

    return rep.view('artist.pug', {
        artist,
        songs,
        user: req.user
    })
}

const getPlaylist = async function(req, rep){
    const playlistId = req.params.playlistId;
    const playlist = await Playlist.findById(playlistId);
    const songs = await Song.find().limit(50);

    return rep.view('playlist.pug', {
        playlist,
        songs,
        user: req.user
    })
}

const getSong = async function(req, rep){
    const songId = req.params.songId;
    const song = await Song.findById(songId).populate('artist', 'name avatar');

    return rep.view('song.pug', {
        song,
        user: req.user
    })
}

module.exports = {
    getHome,
    getProfile,
    getArtist,
    getPlaylist,
    getSong
};