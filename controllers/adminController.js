const fs = require('node:fs');
const path = require('node:path');
const { pipeline } = require('node:stream/promises');
const User = require('../models/User');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

// Quản lý người dùng
const getAllUsers = async function(req, rep){
    try{
        const users = await User.find().select('username email');
        return rep.send(users);
    }catch(err){
        console.log(err);
        rep.code(500).send('Khong the lay users');
    }
}

const getUser = async function(req, rep){
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('-password');
        if(!user){
            return rep.code(500).send('Khong tim duoc nguoi dung')
        }
        return rep.send(user)
    }catch(err){
        console.log(err);
        rep.code(500).send('Khong the lay user');
    }
}

const updateUser = async function(req, rep){
    try{
        const userId = req.params.userId;
        const { username, email, role } = req.body;

        const update = await User.findByIdAndUpdate(
            userId,
            { username, email, role },
            { new: true, runValidators: true }
        ).select('-password')

        if(!update){
            return rep.code(500).send('Khong tim thay thong tin nguoi dung nay');  
        }

        return rep.send('Cap nhat thanh cong');
    }catch(err){
        console.log(err);
        return rep.code(500).send('co loi')
    }
}

const deleteUser = async function(req, rep){
    try{
        const userId = req.params.userId;
        const del = await User.findByIdAndDelete(userId);
        
        // if(req.user.id === userId){
        //     return rep.code(500).send('Khong the xoa chinh minh');
        // }

        if(!del){
            return rep.code(404).send('Khong tim thay thong tin nguoi dung nay')
        }

        return rep.send('Xoa nguoi dung thanh cong'); 
    }catch(err) {
        console.log(err);
        return rep.code(500).send('Co loi khi xoa nguoi dung');
    }
}

// Quản lý Artist
const getAllArtists = async function(req, rep){
    try{
        const artists = await Artist.find();
        rep.send(artists)
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi lay artist');
    }
}

const getArtist = async function(req, rep){
    try{
        const artistId = req.params.artistId;
        const artist = await Artist.findById(artistId)
        if(!artist){
            return rep.code(404).send('Khong tim thay artist');
        }
        return rep.send(artist);
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi lay artist');
    }
}

const createArtist = async function(req, rep){
    try{
        const parts = req.parts();
        const data = {};
        for await (const part of parts){
            let upload
            if(part.type === 'field'){
                data[part.fieldname] = part.value;
            }
            if(part.type === 'file'){
                const uploadCover = path.join(__dirname, '../public/upload/cover', part.filename);
                data.avatar = `/upload/cover/${part.filename}`;
            }
            await pipeline(part.file, fs.createWriteStream(upload))
        }
        const artist = await Artist.create(data);
        rep.send(artist);
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi tao artist');
    }
}

const updateArtist = async function(req, rep){
    try{
        const artistId = req.params.artistId;
        const { name, avatar, bio } = req.body;
        const update = await Artist.findByIdAndUpdate(
            artistId,
            { name, avatar, bio },
            { new: true, runValidators: true }
        )

        if(!update){
            return rep.code(404).send('Khong tim thay artist');
        }

        rep.send('Cap nhat artist thanh cong');
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi cap nhat artist');
    }
}

const deleteArtist = async function(req, rep){
    try{
        const artistId = req.params.artistId;
        const del = await Artist.findByIdAndDelete(artistId);

        if(!del){
            return rep.code(404).send('Khong tim thay artist');
        }

        rep.send('Xoa artist thanh cong')
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi xoa artist');
    }
}

// Quản lý Album

// Quản lý Playlist
const getAllPlaylists = async function(req, rep){
    try{
       const playlists = await Playlist.find().select('playlistName');
       rep.send(playlists);
    } catch (err) {
        console.log(err);
        rep.code(500).send('Co loi khi lay danh sach playlist');
    }
}

const getPlaylist = async function(req, rep){
    try{
        const playlistId = req.params.playlistId;
        const playlist = await Playlist.findById(playlistId);

        if(!playlist){
            return rep.code(404).send('Playlist khong ton tai');
        }

        return rep.send('Lay playlist thanh cong');
    }catch(err){
        console.log(err);
        rep.code(500).send('Co loi khi lay playlist');
    }
}

const createPlaylist = async function(req, rep){
    try{
        const { playlistName, songs, coverURL } = req.body;
        const playlist = await Playlist.create({
            playlistName,
            songs,
            coverURL,
            totalSongs: songs ? songs.length : 0
        });
        rep.send('Tao playlist thanh cong');
    }catch(err){
        console.log(err);
        rep.code(500).send('Co loi trong qua trinh tao playlist')
    }
}

const updatePlaylist = async function(req, rep){
    try{
        const playlistId = req.params.playlistId;
        const { playlistName, songs, coverUrl } = req.body;

        const update = await Playlist.findByIdAndUpdate(
            playlistId,
            { playlistName, songs, coverUrl },
            { new: true, runValidators: true }
        )

        if(!update){
            return rep.code(404).send('Khong tim thay thong tin playlist');
        }

        return rep.send('Cap nhat playlist thanh cong');
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi cap nhat playlist')
    }
}

const deletePlaylist = async function(req, rep){
    try{
        const playlistId = req.params.playlistId;
        const del = await Playlist.findByIdAndDelete(playlistId);

        if(!del){
            return rep.code(404).send("Khong tim thay playlist can xoa")
        }

        rep.send('xoa playlist thanh cong')
    }catch(err) {
        console.log(err);
        rep.code(500).send('Co loi trong qua trinh xoa playlist')
    }
}

// Quản lý bài hát
const getAllSongs = async function(req, rep){
    try{
        const songs = await Song.find().select('songName');
        rep.send(songs);
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi lay tat ca bai hat');
    }
}

const getSong = async function(req, rep){
    try{
       const songId = req.params.songId;
       const song = await Song.findById(songId);
       if(!song){
            return rep.code(404).send('Khong tim thay bai hat');       
       }
       return rep.send(song);
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi lay bai hat');
    }
}

const createSong = async function(req, rep){
    try{
        const parts = req.parts();
        const data = {};
        for await(const part of parts){
            if(part.type === 'field'){
                data[part.fieldname] = part.value;
            }
            if(part.type === 'file'){
                let upload
                if(part.fieldname === 'audio'){
                    const uploadAudio  = path.join(__dirname, '../public/upload/audio', part.filename);
                    data.audioURL = `/upload/audio/${part.filename}`
                }
                if(part.fieldname === 'cover'){
                    const uploadCover  = path.join(__dirname, '../public/upload/audio', part.filename);
                    data.coverURL = `/upload/cover/${part.filename}`
                }
            }
            await pipeline(part.file, fs.createWriteStream(upload))
        }

        if(data.artist && typeof data.artist === 'string'){
            const artist = await Artist.findOne({ name: data.artist });
            if(!artist){
                return rep.code(404).send('Khong tim thay artist');
            }
            data.artist = artist._id;
        }
        const song = await Song.create(data);
        rep.code(200).send('Tao bai hat thanh cong')
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi lay tao bai hat');
    }
}

const updateSong = async function(req, rep){
    try{
        const songId = req.params.songId;
        const { songName, artist } = req.body;

        const update = await Song.findByIdAndUpdate(
            songId,
            { songName, artist },
            { new: true, runValidators: true }
        )

        if(!update){
            return rep.code(404).send('Cap nhat bai hat khong thanh cong');
        }

        return rep.send('Cap nhat bai hat thanh cong');
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi cap nhat bai hat');
    }
}

const deleteSong = async function(req, rep){
    try{
        const songId = req.params.songId;
        const del = await Song.findByIdAndDelete(songId);

        if(!del){
            return rep.code(404).send('Bai hat khong ton tai');
        }

        return rep.send('Xoa bai hat thanh cong')
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi xoa bai hat');
    }
}

module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    createArtist,
    getAllArtists,
    getArtist,
    updateArtist,
    deleteArtist,
    getAllPlaylists,
    getPlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    getAllSongs,
    getSong,
    createSong,
    updateSong,
    deleteSong
}