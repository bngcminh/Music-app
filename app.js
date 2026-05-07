import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import fastifyFormbody from '@fastify/formbody';
import fastifyMutipart from '@fastify/multipart';
import fastifyJWT from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import 'dotenv/config';
import path from 'node:path';

import connect from './config/db.js';
import authentication from './hook/authentication.js';
import authorization from './hook/authorization.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import viewRoute from './routes/viewRoute.js';
import adminRoute from './routes/adminRoute.js';

// Fix Error: querySrv ECONNREFUSED MongoDB
import dns from 'node:dns/promises'
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
fastify.register(userRoute)
fastify.register(viewRoute);
fastify.register(adminRoute);

fastify.get('/playlists/create', { preHandler: [authentication] }, async (req, rep) => {
    return rep.view("create-playlist.pug", { user: req.user });
})

fastify.get('/login', (req, rep) => {
    rep.view("login.pug");
})

fastify.get('/register', (req, rep) => {
    rep.view("register.pug");
})

fastify.listen({ port:3000 }, (err) => {
    // console.log(err);
})
