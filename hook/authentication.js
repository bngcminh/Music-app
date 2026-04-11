async function authentication(req, rep){
    try{
        // await req.jwtVerify()
        const token = req.cookies?.token;
        if(token){
            const user = req.server.jwt.verify(token);
            req.user = user;
        }else{
            req.user = null;
        }
        console.log("result user:", req.user);
    }catch(err){
       return rep.send(err)
    }
}

module.exports = authentication
