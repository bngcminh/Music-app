const User = require('../models/User');
const UserPlaylist = require('../models/userPlaylist');
const fs = require('node:fs');
const path = require('node:path');
const { pipeline } = require('node:stream/promises');
const bcrypt = require('bcryptjs');

const getUpdateProfile = async function(req, rep){
    const infor = await User.findById(req.user.id);
    return rep.view('update_infor.pug', { infor });
}

const updateProfile = async function(req, rep){
    try{
        const id = req.user.id;
        const parts = req.parts();
        const data = {};

        for await(const part of parts){
            console.log(part);
            if(part.type === 'field'){
                data[part.fieldname] = part.value;
            }
            if(part.type === 'file'){
                const uploadCover = path.join(__dirname, '../public/upload/cover', part.filename);
                data.avatar = `/upload/cover/${part.filename}`;
                await pipeline(part.file, fs.createWriteStream(uploadCover))
            }
        }                    
        await User.findByIdAndUpdate(
            id,
            {
                username: data.username,
                email: data.email,
                avatar: data.avatar
            }, { new: true, runValidators: true }
        )
        return rep.redirect('/profile');
    }catch(err){
        console.log(err);
        return rep.code(500).send('Có lỗi trong quá trình cập nhật thông tin');
    }
}

const getPlaylist = async function(req, rep){
    try{
        const playlistId = req.params.playlistId;
        const playlist = await UserPlaylist.findById(playlistId);
        return rep.view('update_playlist.pug', {
            playlist
        }) 
    }catch(err){

    }
}

const createPlaylist = async function(req, rep){
    try {
        const parts = req.parts();
        const data = {};

        for await (const part of parts) {
            if (part.type === 'field') {
                data[part.fieldname] = part.value;
            }
            if (part.type === 'file') {
                const uploadCover = path.join(__dirname, '../public/upload/cover', part.filename);
                data.coverUrl = `/upload/cover/${part.filename}`;
                await pipeline(part.file, fs.createWriteStream(uploadCover));
            }
        }

        const { playlistName, songs } = data;
        await UserPlaylist.create({
            playlistName,
            songs,
            user: req.user.id,
            coverUrl: data.coverUrl,
        });

        rep.redirect('/profile');
    } catch (err) {
        console.log(err);
        return rep.code(500).send('Co loi trong qua trinh tao playlist');
    }
}

const updatePlaylist = async function(req, rep){
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
        const update = await UserPlaylist.findByIdAndUpdate(
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

        rep.redirect('/profile');
    }catch(err){
        console.log(err);
        return rep.code(500).send('Co loi khi cap nhat playlist')
    }
}

const deletePlaylist = async function(req, rep){
    try{
        const playlistId = req.params.playlistId;
        const del = await UserPlaylist.findByIdAndDelete(playlistId);

        if(!del){
            return rep.code(404).send("Khong tim thay playlist can xoa")
        }

        rep.redirect('/profile');
    }catch(err) {
        console.log(err);
        rep.code(500).send('Co loi trong qua trinh xoa playlist')
    }
}

module.exports = {
    getUpdateProfile,
    updateProfile,
    getPlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist
};
