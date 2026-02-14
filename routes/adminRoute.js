const adminController = require('../controllers/adminController');

function adminRoute(fastify, options){
    // User API
    fastify.get('/users', adminController.getAllUsers);
    fastify.get('/users/:userId', adminController.getUser);
    fastify.patch('/users/:userId', adminController.updateUser);
    fastify.delete('/users/:userId', adminController.deleteUser);

    // Artist API
    fastify.get('/artists', adminController.getAllArtists);
    fastify.get('/artists/:artistId', adminController.getArtist);
    fastify.post('/artists', adminController.createArtist)
    fastify.patch('/artists/:artistId', adminController.updateArtist);
    fastify.delete('/artists/:artistId', adminController.deleteArtist); 
}

module.exports = adminRoute;