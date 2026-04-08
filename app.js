require('dotenv').config()

const fastify = require('fastify')({ logger: true });
const fastifyStatic = require('@fastify/static')
const fastifyViews = require('@fastify/view');
const fastifyFormbody = require('@fastify/formbody');
const fastifyMutipart = require('@fastify/multipart')
const fastifyJWT = require('@fastify/jwt');
const fastifyCookie = require('@fastify/cookie');
const path = require('node:path');

const connectDB = require('./config/db');
const authentication = require('./hook/authentication');
const authorization = require('./hook/authorization');
const authRoute = require('./routes/authRoute');
const adminRoute  = require('./routes/adminRoute');

// Fix Error: querySrv ECONNREFUSED MongoDB
const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1']);

// Connect MongoDB
// fastify.register(connectDB, {
//     forceClose: false,
//     url: process.env.DATABASE
// })

// MongoDB
fastify.register(connectDB);

// Jwt
fastify.register(fastifyJWT, {
    secret: 'projectBE'
})

// Cookie
fastify.register(fastifyCookie, {
    hook: 'onRequest'
})

// View file
fastify.register(fastifyViews, {
    engine: {
        pug: require('pug'),
    },
    root: path.join(__dirname, ('views'))
})

// Static file
fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/'
})

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public/upload'),
    prefix: '/upload/',
    decorateReply: false
})

fastify.register(fastifyMutipart,{
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});
fastify.register(fastifyFormbody)

fastify.register(authRoute);
fastify.register(adminRoute);

fastify.get('/', {preHandler: [authentication]},async (req, rep) => {
    return rep.view("home.pug", { user: req.user });
})

fastify.get('/profile', { preHandler: authentication }, async (req, rep) => {
    if (!req.user) {
        return rep.redirect('/login');
    }
    return rep.view('profile.pug', { user: req.user });
})

fastify.get('/song', { preHandler: authentication }, async (req, rep) => {
    return rep.view("songs.pug", { user: req.user });
})

fastify.get('/playlist', { preHandler: authentication }, async (req, rep) => {
    return rep.view("playlists.pug", { user: req.user });
})

fastify.get('/playlists/create', { preHandler: [authentication] }, async (req, rep) => {
    if (!req.user) {
        return rep.redirect('/login');
    }
    return rep.view("create-playlist.pug", { user: req.user });
})

fastify.get('/my-playlists', { preHandler: [authentication] }, async (req, rep) => {
    if (!req.user) {
        return rep.redirect('/login');
    }
    return rep.view("my-playlists.pug", { user: req.user });
})

fastify.get('/login', (req, rep) => {
    // rep.send('hello world');
    rep.view("login.pug");
})

fastify.get('/register', (req, rep) => {
    // rep.send('hello world');
    rep.view("register.pug");
})

fastify.get('/admin', {preHandler: [authentication, authorization('admin')]}, (req, rep) => {
    rep.view("admin/dashboard.pug", { user: req.user });
})

// fastify.get('/admin/users', {preHandler: [authentication, authorization('admin')]}, (req, rep) => {
//     rep.view("admin/users.pug", { user: req.user });
// })

// fastify.get('/admin/artists', {preHandler: [authentication, authorization('admin')]}, (req, rep) => {
//     rep.view("admin/playlists.pug", { user: req.user });
// })

// fastify.get('/admin/songs', {preHandler: [authentication, authorization('admin')]}, (req, rep) => {
//     rep.view("admin/songs.pug", { user: req.user });
// })

// fastify.get('/admin/playlists', {preHandler: [authentication, authorization('admin')]}, (req, rep) => {
//     rep.view("admin/playlists.pug", { user: req.user });
// })

fastify.listen({ port:3000 }, (err) => {
    // console.log(err);
})