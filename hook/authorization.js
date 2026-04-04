function authorization(role){
    return(req, rep, done) => {
        if(req.user && req.user.role === role){
            done();
        }else{
            rep.redirect('/');
        }
    }
}

module.exports = authorization