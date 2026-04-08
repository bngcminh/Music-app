const Playlist = require('../models/Playlist');

const getAllPlaylists = async function(req, rep){
    try{
        const artist = await Playlist.find().select('playlistName');
        rep.send(artist);
    }catch(err){
        console.log(err);
        rep.code(500).send('Co loi trong qua trinh lay danh sach playlist') 
    }
}

const getPlaylist = async function(req, rep){
    try{
        
    }catch(err){

    }
}