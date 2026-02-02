const authController = require('../controllers/authController');

async function authRoute(fastify, options) {
    fastify.post('/register', authController.register)
    fastify.post('/login', authController.login)
}

module.exports = authRoute