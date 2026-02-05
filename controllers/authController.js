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
    
    try{
        const user = await User.create({
            username,
            email,
            password,
        })
    }catch(err){
        console.log(err);
    }
    // return rep.code(201).send('Đăng ký thành công').redirect('/login')
    return rep.redirect('/login')
}

const login = async function(req, rep){
    const { username, password } = req.body;
    const existAccount = await User.findOne({ username });
    
    console.log("result", null.password)
    // if(!username || !password){
    //     return rep.code(400).send('Vui long nhap day du thong tin');
    // }else if(!existAccount || existAccount.password !== password){
    //     return rep.code(400).send('Tai khoan hoac mat khau khong dung');
    // }
    //password !== existAccount.password
    return rep.redirect('/')
}

module.exports = {
    register,
    login,
    // logout
}