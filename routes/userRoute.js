const userContrroller = require('../controllers/userController');
const authentication = require('../hook/authentication');

function userRoute(fastify, option){
    fastify.get('/update/profile', { preHandler: authentication }, userContrroller.getUpdateProfile);
    fastify.post('/update/profile', { preHandler: authentication }, userContrroller.updateProfile);
    fastify.post('/create/playlist', { preHandler: authentication }, userContrroller.createPlaylist);
    fastify.get('/update/playlist/:playlistId', { preHandler: authentication }, userContrroller.getPlaylist);
    fastify.post('/update/playlist/:playlistId', { preHandler: authentication }, userContrroller.updatePlaylist);
    fastify.get('/delete/playlist/:playlistId', { preHandler: authentication }, userContrroller.deletePlaylist);
    fastify.post('/changePassword', { preHandler: authentication }, userContrroller.changePassword)
}

module.exports = userRoute