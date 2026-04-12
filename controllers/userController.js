const User = require('../models/User');
const UserPlaylist = require('../models/userPlaylist');
const fs = require('node:fs');
const path = require('node:path');
const { pipeline } = require('node:stream/promises');
const bcrypt = require('bcryptjs');
const userPlaylist = require('../models/userPlaylist');

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
        await userPlaylist.create({
            playlistName,
            songs,
            coverUrl: data.coverUrl,
        });

        rep.redirect('/profile');
    } catch (err) {
        console.log(err);
        return rep.code(500).send('Co loi trong qua trinh tao playlist');
    }
}

module.exports = {
    getUpdateProfile,
    updateProfile,
    createPlaylist,
};
