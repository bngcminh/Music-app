const Playlist = require('../models/Playlist');
const playlist = require('../models/Playlist');

const createPlaylist = async function(req, rep){
    try{
        const { playlistName } = req.body;
        const playlist = await Playlist.create({
            playlistName
        });
        rep.send(playlist)
    }catch(err){
        console.log(err);
        rep.code(500).send('Co loi trong qua trinh tao playlist')
    }
}

const getAllPlaylist = async function(req, rep){
    try{
        const artist = await Playlist.find().select('playlistName');
        rep.send(artist);
    }catch(err){
        console.log(err);
        rep.code(500).send('Co loi trong qua trinh lay danh sach playlist') 
    }
}