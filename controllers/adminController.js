const fs = require('node:fs');
const path = require('node:path')
const User = require('../models/User');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

// Quản lý người dùng
const getAllUsers = async function(req, rep){
    try{
        const users = await User.find().select('username email');
        console.log
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
            if(part.type === 'field'){
                data[part.fieldname] = part.value;
            }
            if(part.type === 'file'){
                const fileName = Date.now() + ' - ' + part.filename;
                const upload = path.join(__dirname, '../public/upload', fileName);

                await fs.promises.writeFile(upload, await part.toBuffer());

                data.avatar = `/upload/${fileName}`;
            }
        }
        const artist = await Artist.create(data);
        rep.send('Tao artist thanh cong')
    }catch(err){
        console.log(err);
        rep.code(500).send('Co loi khi tao artist');
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

module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    createArtist,
    getAllArtists,
    getArtist,
    updateArtist,
    deleteArtist
}