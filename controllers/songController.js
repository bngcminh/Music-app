const Song = require('../models/Song');

const getAllSongs = async function(req, rep){
   try{
        const songs = await Song.find().limit(10);
        rep.send(songs);
   }catch(err){
        rep.code(500).send(err);
   }
}

const getSong = async function(req, rep){
    try{
        const song = await Song.findById(req.params.songId);
        rep.send(song)
    }catch(err){
        rep.code(500).send(err);
    }
}

