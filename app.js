require('dotenv').config()

const fastify = require('fastify')({ logger: true });
const fastifyStatic = require('@fastify/static')
const fastifyViews = require('@fastify/view');
const fastifyFormbody = require('@fastify/formbody');
const fastifyMutipart = require('@fastify/multipart')
const fastifyJWT = require('@fastify/jwt');
const fastifyCookie = require('@fastify/cookie');
const path = require('node:path');

const connectDB = require('./config/db')
const authentication = require('./hook/authentication');
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

// Authentication
fastify.register(authentication);

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

fastify.get('/', (req, rep) => {
    // rep.send('hello world');
    return rep.view("home.pug", );
})

fastify.get('/login', (req, rep) => {
    // rep.send('hello world');
    rep.view("login.pug");
})

fastify.get('/register', (req, rep) => {
    // rep.send('hello world');
    rep.view("register.pug");
})

fastify.get('/admin', (req, rep) => {
    rep.view("admin/dashboard.pug")
})

fastify.get('/admin/users', (req, rep) => {
    rep.view("admin/users.pug")
})

fastify.get('/admin/artists', (req, rep) => {
    rep.view("admin/artists.pug")
})

fastify.get('/admin/songs', (req, rep) => {
    rep.view("admin/songs.pug")
})

fastify.get('/admin/playlists', (req, rep) => {
    rep.view("admin/playlists.pug")
})

// fastify.listen({ port: 3000 }, (err) => {
//     if(err){
//         fastify.log.error(err);
//         process.exit(1);
//     }else{

//     }
// })

fastify.listen({ port:3000 }, (err) => {
    console.log(err);
})