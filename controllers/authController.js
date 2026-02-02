const fastify = require('fastify');
const User = require('../models/User')

const register = async function(req, rep){
    const { username, email, password } = req.body;

    if(!username || !email || !password){
        rep.send('Vui lòng nhập đầy đủ thông tin');
        rep.code(500);
    }else if(username < 6 || password < 6){
        rep.send('Tên người dùng và mật khẩu phải trên 6 kí tự');
        rep.statusCode = 500;
    }

    const existEmail = await User.findOne({ email });

    if(existEmail){
        rep.send('Email đã tồn tại');
        rep.code(500);
    }

    const user = await User.create({
        username,
        email,
        password,
    })

    return rep.code(201).send('Đăng ký thành công').redirect('/login')

}

// const login = async function(){
//     const { username, password } = req.body;
//     if(!username || !password){
//         return
//     }
// }

module.exports = {
    register,
    // login,
    // logout
}