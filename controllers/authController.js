const fastify = require('fastify');
const User = require('../models/User')

const register = async function(req, rep){
    const { username, email, password } = req.body;

    if(!username || !email || !password){
        rep.send('Vui lòng nhập đầy đủ thông tin');
        return rep.code(500);
    }else if(username.length < 6 || password.length < 6){
        // rep.send('Tên người dùng và mật khẩu phải trên 6 kí tự');
        // rep.code(500);
        return rep.code(500).send('Tên người dùng và mật khẩu phải trên 6 kí tự')
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

    // return rep.code(201).send('Đăng ký thành công').redirect('/login')
    return rep.redirect('/login')
}

const login = async function(req, rep){
    const { username, password } = req.body;
    const existUsername = await User.findOne({ username });
    const existPassword= await User.findOne({ password }) 
    
    if(!username || !password){
        return rep.code(400).send('Vui lòng nhập đầy đủ thông tin');
    }else if(username !== existUsername || password !== existPassword){
        return rep.code(400).send('Tài khoản hoặc mật khẩu không đúng')
    }else{
        return rep.redirect('/')
    }
     
}

module.exports = {
    register,
    login,
    // logout
}