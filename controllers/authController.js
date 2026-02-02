const fastify = require('fastify');
const User = require('../models/User')

const login = async function(){
    const { username, password } = req.body;
    if(!username || !password){
        return
    }
}

module.exports = {
    register,
    login,
    logout
}