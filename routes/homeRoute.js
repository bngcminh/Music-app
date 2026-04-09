const homeController = require('../controllers/homeConntroller');
const authentication = require('../hook/authentication');

function homeRoute(fastify, options){
    fastify.get('/', { preHandler: authentication }, homeController);
}

module.exports = homeRoute;