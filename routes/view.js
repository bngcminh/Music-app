const User = require('../models/User');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');
const Artist = require('../models/Artist');

fastify.get('/', { preHandler: authentication }, async (req, rep) => {
    const user = req.user || null;
    return rep.view("home.pug", { user });
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
    rep.view("admin/dashboard.pug")
})

fastify.get('/admin/users', {preHandler: authorization('admin')}, (req, rep) => {
    rep.view("admin/users.pug")
})

fastify.get('/admin/artists', {preHandler: authorization('admin')}, (req, rep) => {
    rep.view("admin/artists.pug")
})

fastify.get('/admin/songs', {preHandler: authorization('admin')}, (req, rep) => {
    rep.view("admin/songs.pug")
})

fastify.get('/admin/playlists', {preHandler: authorization}, (req, rep) => {
    rep.view("admin/playlists.pug")
})