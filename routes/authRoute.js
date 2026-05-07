import * as authController from '../controllers/authController.js';

export function authRoute(fastify, options) {
    fastify.post('/register', authController.register)
    fastify.post('/login', authController.login)
    fastify.get('/logout', authController.logout)
}
