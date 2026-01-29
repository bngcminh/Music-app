import Fastify from 'fastify';
const fastify = Fastify({logger: true});

fastify.get('/', (req, rep) => {
    rep.send('Test server');
})

fastify.listen({host: '127.0.0.1',port: 3000}, (err, address) => {
    if(err){
        fastify.log.error(err);
        process.exit(1);
    }else{
        console.log(address);
    }
})