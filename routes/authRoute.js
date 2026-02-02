const authController = require('../controllers/authController');

async function authRoute(fastify, options) {
    fastify.post('/register', authController.register)
}

module.exports = authRoute