const adminController = require('../controllers/adminController');

function adminRoute(fastify, options){
    fastify.get('/users', adminController.getAllUsers);
    fastify.get('/users/:userId', adminController.getUser);
    fastify.patch('/users/:userId', adminController.updateUser);
    fastify.delete('/users/:userId', adminController.deleteUser);
}

module.exports = adminRoute;