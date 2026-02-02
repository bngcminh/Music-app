require('dotenv').config()

const fastify = require('fastify')({ logger: true });
const fastifyStatic = require('@fastify/static')
const fastifyViews = require('@fastify/view');
const fastifyFormbody = require('@fastify/formbody');
const path = require('node:path');
// const connectDB = require('@fastify/mongodb');
const connectDB = require('./config/db')

const authRoute = require('./routes/authRoute');

// Fix Error: querySrv ECONNREFUSED MongoDB
const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1']);

// Connect MongoDB
// fastify.register(connectDB, {
//     forceClose: false,
//     url: process.env.DATABASE
// })

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

fastify.register(fastifyFormbody);

fastify.register(authRoute);

fastify.get('/', (req, rep) => {
    // rep.send('hello world');
    rep.view("home.pug");
})

fastify.get('/login', (req, rep) => {
    // rep.send('hello world');
    rep.view("login.pug");
})

fastify.get('/register', (req, rep) => {
    // rep.send('hello world');
    rep.view("register.pug");
})

// fastify.listen({ port: 3000 }, (err) => {
//     if(err){
//         fastify.log.error(err);
//         process.exit(1);
//     }else{

//     }
// })

async function start() {
    try {
        await fastify.register(connectDB);
        console.log('ket noi mongodb thanh cong')
        fastify.listen({ port: 3000 })
    }catch(err){
        fastify.log.error(err);
        process.exit(1);
    }
}

start();