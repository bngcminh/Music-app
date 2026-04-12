const userContrroller = require('../controllers/userController');
const authentication = require('../hook/authentication');

function userRoute(fastify, option){
    fastify.get('/update/profile', { preHandler: authentication }, userContrroller.getUpdateProfile);
    fastify.post('/update/profile', { preHandler: authentication }, userContrroller.updateProfile);
    fastify.post('/create/playlist', { preHandler: authentication }, userContrroller.createPlaylist);
}

module.exports = userRoute