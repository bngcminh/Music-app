import * as viewConntroller from '../controllers/viewConntroller.js';
import authentication from '../hook/authentication.js';

export function viewRoute(fastify, options){
    fastify.get('/', { preHandler: authentication }, homeController.getHome);
    fastify.get('/profile', { preHandler: authentication }, homeController.getProfile);
    fastify.get('/artist/:artistId', { preHandler: authentication }, homeController.getArtist);
    fastify.get('/playlist/:playlistId', { preHandler: authentication }, homeController.getPlaylist);
    fastify.get('/song/:songId', { preHandler: authentication }, homeController.getSong);
}