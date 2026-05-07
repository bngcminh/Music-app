import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import User from '../models/User.js';
import Artist from '../models/Album.js';
import Album from '../models/Album.js';
import Playlist from '../models/Playlist.js';
import Song from '../models/Song.js';

// Dashboard
export const getDashboard = async function(req, rep){
    const users = await User.find().select('_id');
    const songs = await Song.find().select('_id');
    const playlists = await Playlist.find().select('_id');
    const artists = await Artist.find().select('_id');

    return rep.view("admin/dashboard.pug", {
        users,
        songs,
        playlists,
        artists,
        user: req.user 
    });
}

// Quản lý người dùng
export const getAllUsers = async function(req, rep){
    try{
        const users = await User.find();
        console.log(users)
        return rep.view('admin/users.pug', {
            users,
            user: req.user 
        });
    }catch(err){
        console.log(err);
        rep.code(500).send('Khong the lay users');
    }
}

export const getUser = async function(req, rep){
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('-password');
        if(!user){
            return rep.code(500).send('Khong tim duoc nguoi dung')
        }
        return rep.view('admin/update_user.pug', {user})
    }catch(err){
        console.log(err);
        rep.code(500).send('Khong the lay user');
    }
}

export const updateUser = async function(req, rep){
    try{
        const userId = req.params.userId;
        const { username, email, role } = req.body;

        await User.findByIdAndUpdate(
            userId,
            { username, email, role },
            { new: true, runValidators: true }
        )

        return rep.redirect('/admin/users');
    }catch(err){
        console.log(err);
        return rep.code(500).send('co loi')
    }
}

export const deleteUser = async function(req, rep){
    try{
        const userId = req.params.userId;
        if(req.user.id === userId){
            return rep.code(500).send('Khong the xoa chinh minh');
        }
        await User.findByIdAndDelete(userId);
        return rep.redirect('/admin/users');
    }catch(err) {
        console.log(err);
        return rep.code(500).send('Co loi khi xoa nguoi dung');
    }
}

// Quản lý Artist
export const getAllArtists = async function(req, rep){
    try{
        const artists = await Artist.find();
        return rep.view('admin/artists.pug', {
            artists,
            user: req.user 
        });
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi lay artist');
    }
}

export const getArtist = async function(req, rep){
    try{
        const artistId = req.params.artistId;
        const artist = await Artist.findById(artistId)
        if(!artist){
            return rep.code(404).send('Khong tim thay artist');
        }
        console.log(artist);
        return rep.view('admin/update_artist.pug', {artist});
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi lay artist');
    }
}

export const createArtist = async function(req, rep){
    try{
        const parts = req.parts();
        const data = {};
        for await (const part of parts){
            if(part.type === 'field'){
                data[part.fieldname] = part.value;
            }
            if(part.type === 'file' && part.filename){
                const uploadCover = path.join(__dirname, '../public/upload/cover', part.filename);
                data.avatar = `/upload/cover/${part.filename}`;
                await pipeline(part.file, fs.createWriteStream(uploadCover))
            }
            
        }
        const artist = await Artist.create(data);
        return rep.redirect('/admin/artists');
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi tao artist');
    }
}

export const updateArtist = async function(req, rep){
    try{
        const artistId = req.params.artistId;
        const parts = req.parts();
        const data = {};
        for await(const part of parts){
            if(part.type === 'field'){
                data[part.fieldname] = part.value;
            }
            if(part.type === 'file' && part.filename){
                const uploadAvatar = path.join(__dirname, '../public/upload/cover', part.filename);
                data.avatar = `/upload/cover/${part.filename}`;
                await pipeline(part.file, fs.createWriteStream(uploadAvatar))
            }
        }
        const update = await Artist.findByIdAndUpdate(
            artistId,
            { 
                name: data.name, 
                avatar: data.avatar, 
                bio: data.bio 
            },
            { new: true, runValidators: true }
        )

        if(!update){
            return rep.code(404).send('Khong tim thay artist');
        }

        rep.redirect('/admin/artists');
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi cap nhat artist');
    }
}

export const deleteArtist = async function(req, rep){
    try{
        const artistId = req.params.artistId;
        const del = await Artist.findByIdAndDelete(artistId);

        if(!del){
            return rep.code(404).send('Khong tim thay artist');
        }

        return rep.redirect('/admin/artists');
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi xoa artist');
    }
}

// Quản lý Album

// Quản lý Playlist
export const getAllPlaylists = async function(req, rep){
    try{
       const playlists = await Playlist.find().select('playlistName songs coverUrl');
       const songs = await Song.find().select('songName');
       console.log(playlists);
       return rep.view('admin/playlists.pug', {
            playlists, 
            songs,
            user: req.user 
        });
    } catch (err) {
        console.log(err);
        rep.code(500).send('Co loi khi lay danh sach playlist');
    }
}

export const getPlaylist = async function(req, rep){
    try{
        const playlistId = req.params.playlistId;
        const playlist = await Playlist.findById(playlistId).populate('songs', 'songName');

        if(!playlist){
            return rep.code(404).send('Playlist khong ton tai');
        }

        return rep.view('admin/update_playlist.pug', { playlist });
    }catch(err){
        console.log(err);
        rep.code(500).send('Co loi khi lay playlist');
    }
}

export const createPlaylist = async function(req, rep){
    try {
        const parts = req.parts();
        const data = {};

        for await (const part of parts) {
            if (part.type === 'field') {
                data[part.fieldname] = part.value;
            }
            if (part.type === 'file' && part.filename) {
                const uploadCover = path.join(__dirname, '../public/upload/cover', part.filename);
                data.coverUrl = `/upload/cover/${part.filename}`;
                await pipeline(part.file, fs.createWriteStream(uploadCover));
            }
        }

        const { playlistName, songs } = data;
        const playlist = await Playlist.create({
            playlistName,
            songs,
            coverUrl: data.coverUrl,
        });

        return rep.redirect('/admin/playlists');
    } catch (err) {
        console.log(err);
        return rep.code(500).send('Co loi trong qua trinh tao playlist');
    }
}

export const updatePlaylist = async function(req, rep){
    try{
        const playlistId = req.params.playlistId;
        const parts = req.parts();
        const data = {};
        for await(const part of parts){
            if(part.type === 'field'){
                if (part.fieldname === 'songs') {
                    if (!Array.isArray(data.songs)) {
                        data.songs = [];
                    }
                    data.songs.push(part.value);
                    continue;
                }
                data[part.fieldname] = part.value;
            }
            if(part.type === 'file' && part.filename){
                if(part.fieldname === 'coverUrl'){
                    const uploadCover = path.join(__dirname, '../public/upload/cover', part.filename);
                    data.coverUrl = `/upload/cover/${part.filename}`;
                    await pipeline(part.file, fs.createWriteStream(uploadCover))
                }
            }
        }
        const update = await Playlist.findByIdAndUpdate(
            playlistId,
            { 
                playlistName: data.playlistName, 
                songs: data.songs, 
                coverUrl: data.coverUrl },
            { new: true, runValidators: true }
        )

        if(!update){
            return rep.code(404).send('Khong tim thay thong tin playlist');
        }

        rep.redirect('/admin/playlists');
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi cap nhat playlist')
    }
}

export const deletePlaylist = async function(req, rep){
    try{
        const playlistId = req.params.playlistId;
        const del = await Playlist.findByIdAndDelete(playlistId);

        if(!del){
            return rep.code(404).send("Khong tim thay playlist can xoa")
        }

        rep.redirect('/admin/playlists');
    }catch(err) {
        console.log(err);
        rep.code(500).send('Co loi trong qua trinh xoa playlist')
    }
}

// Quản lý bài hát
export const getAllSongs = async function(req, rep){
    try{
        const songs = await Song.find().populate('artist', 'name');
        console.log(songs);
        return rep.view('admin/songs.pug', {
            songs,
            user: req.user 
        })
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi lay tat ca bai hat');
    }
}

export const getSong = async function(req, rep){
    try{
       const songId = req.params.songId;
       const song = await Song.findById(songId).populate('artist', 'name');
       if(!song){
            return rep.code(404).send('Khong tim thay bai hat');       
       }
       return rep.view('admin/update_song.pug', {song});
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi lay bai hat');
    }
}

export const createSong = async function(req, rep){
    try{
        const parts = req.parts();
        const data = {};
        for await(const part of parts){
            if(part.type === 'field'){
                data[part.fieldname] = part.value;
            }
            if(part.type === 'file' && part.filename){
                if(part.fieldname === 'audioUrl'){
                    const uploadAudio  = path.join(__dirname, '../public/upload/audio', part.filename);
                    data.audioUrl = `/upload/audio/${part.filename}`
                    await pipeline(part.file, fs.createWriteStream(uploadAudio));
                }
                if(part.fieldname === 'coverUrl'){
                    const uploadCover  = path.join(__dirname, '../public/upload/cover', part.filename);
                    data.coverUrl = `/upload/cover/${part.filename}`
                    await pipeline(part.file, fs.createWriteStream(uploadCover));
                }
            }
        }

        if(data.artist && typeof data.artist === 'string'){
            const artist = await Artist.findOne({ name: data.artist });
            if(!artist){
                return rep.code(404).send('Khong tim thay artist');
            }
            data.artist = artist._id;
        }
        const user = await Song.create(data);
        rep.redirect('/admin/songs')
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi lay tao bai hat');
    }
}

export const updateSong = async function(req, rep){
    try{
        const songId = req.params.songId;
        const parts = req.parts();
        const data = {};
        for await(const part of parts){
            if(part.type === 'field'){
                data[part.fieldname] = part.value;
            }
            if(part.type === 'file' && part.filename){
                if(part.fieldname === 'audioUrl'){
                    const uploadAudio = path.join(__dirname, '../public/upload/audio', part.filename);
                    data.audioUrl = `/upload/audio/${part.filename}`
                    await pipeline(part.file, fs.createWriteStream(uploadAudio));
                }
                if(part.fieldname === 'coverUrl'){
                    const uploadCover = path.join(__dirname, '../public/upload/cover', part.filename);
                    data.coverUrl = `/upload/cover/${part.filename}`
                    await pipeline(part.file, fs.createWriteStream(uploadCover));
                }
            }
        }

        const artistName = await Artist.findOne({ name: data.artist });
        const update = await Song.findByIdAndUpdate(
            songId,
            { 
                songName: data.songName, 
                artist: artistName._id,
                coverUrl: data.coverUrl,
                audioUrl: data.audioUrl
            },
            { new: true, runValidators: true }
        )

        if(!update){
            return rep.code(404).send('Cap nhat bai hat khong thanh cong');
        }
        console.log(update)
        return rep.redirect('/admin/songs')
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi cap nhat bai hat');
    }
}

export const deleteSong = async function(req, rep){
    try{
        const songId = req.params.songId;
        const del = await Song.findByIdAndDelete(songId);

        if(!del){
            return rep.code(404).send('Bai hat khong ton tai');
        }

        rep.redirect('/admin/songs')
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi xoa bai hat');
    }
}
