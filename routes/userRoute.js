const userContrroller = require('../controllers/userController');
const authentication = require('../hook/authentication');

function userRoute(fastify, option){
    fastify.get('/profile', { preHandler: [authentication, authorization('admin')] }, userContrroller.getProfile)
}