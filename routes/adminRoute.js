const adminController = require('../controllers/adminController');

function userAPI(fastify, options){
    fastify.get('/users', adminController.getAllUsers);
    fastify.get('/users/:userId', adminController.getUser);
    fastify.patch('/users/:userId', adminController.updateUser);
    fastify.delete('/users/:userId', adminController.deleteUser);
}

function artistAPI(fastify, options){
    fastify.get('/users', adminController.getAllArtists);
    fastify.get('/users/:userId', adminController.getArtist);
    fastify.patch('/users/:userId', adminController.updateArtist);
    fastify.delete('/users/:userId', adminController.deleteArtist); 
}

module.exports = {
    userAPI,
    artistAPI,
};