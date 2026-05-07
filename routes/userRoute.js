import * as userContrroller from '../controllers/userController.js'
import authentication from '../hook/authentication.js';

export function userRoute(fastify, option){
    fastify.get('/update/profile', { preHandler: authentication }, userContrroller.getUpdateProfile);
    fastify.post('/update/profile', { preHandler: authentication }, userContrroller.updateProfile);
    fastify.post('/create/playlist', { preHandler: authentication }, userContrroller.createPlaylist);
    fastify.get('/update/playlist/:playlistId', { preHandler: authentication }, userContrroller.getPlaylist);
    fastify.post('/update/playlist/:playlistId', { preHandler: authentication }, userContrroller.updatePlaylist);
    fastify.get('/delete/playlist/:playlistId', { preHandler: authentication }, userContrroller.deletePlaylist);
    fastify.get('/song/:songId/select-playlist', { preHandler: authentication }, userContrroller.getSelectPlaylistPage);
    fastify.post('/song/:songId/select-playlist', { preHandler: authentication }, userContrroller.addSongToPlaylist);
    fastify.post('/changePassword', { preHandler: authentication }, userContrroller.changePassword)
}
