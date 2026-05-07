import User from '../models/User.js';
import userPlaylist from '../models/userPlaylist.js';
import Song from '../models/Song.js';
import Playlist from '../models/Playlist.js';
import Artist from '../models/Artist.js'

export const getHome = async function(req, rep){
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

export const getProfile = async function(req, rep){
    const infor = await User.findById(req.user.id);
    const playlists = await UserPlaylist.find({user: req.user.id});
    
    return rep.view('profile.pug',{
        infor,
        playlists,
        user: req.user || null
    });
}

export const getArtist = async function(req, rep){
    const artistId = req.params.artistId;
    const artist = await Artist.findById(artistId);
    const songs = await Song.find({ artist: artistId }).select('songName artist coverUrl audioUrl').populate('artist', 'name');
    console.log(songs)
    return rep.view('artist.pug', {
        artist,
        songs,
        user: req.user
    })
}

export const getPlaylist = async function(req, rep){
    const playlistId = req.params.playlistId;
    const playlist = await Playlist.findById(playlistId).populate({path: 'songs', populate: { path: 'artist', select: 'name' }});
    return rep.view('playlist.pug', {
        playlist,
        songs: playlist.songs,
        user: req.user
    })
}

export const getSong = async function(req, rep){
    const songId = req.params.songId;
    const song = await Song.findById(songId).populate('artist', 'name avatar');
    return rep.view('song.pug', {
        song,
        user: req.user
    })
}
