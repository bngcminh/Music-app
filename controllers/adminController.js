const User = require('../models/User');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

// User
const getAllUsers = async function(req, rep){
    try{
        const users = await User.find().select('username email -password');
        return users;
    }catch(err){
        rep.code(500).send('Khong the lay users');
        console.log(err);
    }
}

const getUser = async function(req, rep){
    try {
        const idUser = req.params.id;
        const user = await User.findById(idUser).select('username email -password');
        if(!user){
            return rep.code(500).send('Khong tim duoc nguoi dung')
        }
        return rep.send(user)
    }catch(err){
        rep.code(500).send('Khong the lay user');
        console.log(err);
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
        const userId = req.params;
        const del = User.findByIdAndDelete(userId);
        
        // if(req.user.id === userId){
        //     return rep.code(500).send('Khong the xoa chinh minh');
        // }

        if(!del){
            return rep.code(500).send('Khong tim thay thong tin nguoi dung nay')
        }

        return rep.send('Xoa nguoi dung thanh cong'); 
    }catch(err) {
        return rep.code(500).send('Co loi khi xoa nguoi dung');
        console.log(err);
    }
}

module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
}