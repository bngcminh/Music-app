const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
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
    
    const salt = await bcrypt.genSalt(10);
    const hashPassword =  await bcrypt.hash(password, salt)

    try{
        const user = await User.create({
            username,
            email,
            password: hashPassword,
        })
    }catch(err){
        console.log(err);
    }
    // return rep.code(201).send('Đăng ký thành công').redirect('/login')
    return rep.redirect('/login')
}

const login = async function(req, rep){
    const { email, password } = req.body;
    
    // console.log("result", null.password)
    // if(!username || !password){
    //     return rep.code(400).send('Vui long nhap day du thong tin');
    // }else if(!existAccount || existAccount.password !== password){
    //     return rep.code(400).send('Tai khoan hoac mat khau khong dung');
    // }
    //password !== existAccount.password

    if(!email || !password){
        return rep.code(400).send('Vui long nhap day du thong tin');
    }
    const existAccount = await User.findOne({ email });
    console.log(existAccount);
    if(!existAccount){
        return rep.code(400).send('Tai khoan hoac mat khau khong dung');
    }
    const comparePassword = await bcrypt.compare(password, existAccount.password);
    console.log('result: ', comparePassword);
    if(!comparePassword){
        return rep.code(400).send('Tai khoan hoac mat khau khong dung');
    }

    // const token = {

    // }

    return rep.redirect('/')
}

module.exports = {
    register,
    login,
    // logout
}