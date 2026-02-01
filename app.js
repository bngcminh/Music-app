require('dotenv').config()

const fastify = require('fastify')({ logger: true });
const fastifyStatic = require('@fastify/static')
const fastifyViews = require('@fastify/view');
const path = require('node:path');
const connectDB = require('@fastify/mongodb');

// Fix Error: querySrv ECONNREFUSED MongoDB
const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1']);

// Connect MongoDB
fastify.register(connectDB, {
    forceClose: false,
    url: process.env.DATABASE
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

fastify.get('/', (req, rep) => {
    // rep.send('hello world');
    rep.view("home.pug");
})

fastify.listen({ port: 3000 }, (err) => {
    if(err){
        fastify.log.error(err);
        process.exit(1);
    }else{

    }
})