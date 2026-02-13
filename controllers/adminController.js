const User = require('../models/User');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

// User
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

module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
}