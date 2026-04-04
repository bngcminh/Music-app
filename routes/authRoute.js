const authController = require('../controllers/authController');

function authRoute(fastify, options) {
    fastify.post('/register', authController.register)
    fastify.post('/login', authController.login)
    fastify.get('/logout', authController.logout)
}

module.exports = authRoute