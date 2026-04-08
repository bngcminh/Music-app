const adminController = require('../controllers/adminController');
const authentication = require('../hook/authentication');
const authorization = require('../hook/authorization');

function adminRoute(fastify, options){
    // User API
    fastify.get('/admin/users', {preHandler: [authentication, authorization('admin')]},adminController.getAllUsers);
    fastify.get('/admin/users/:userId', adminController.getUser);
    fastify.patch('/admin/users/:userId', adminController.updateUser);
    fastify.delete('/admin/users/:userId', adminController.deleteUser);

    // Artist API
    fastify.get('/admin/artists', adminController.getAllArtists);
    fastify.get('/admin/artists/:artistId', adminController.getArtist);
    fastify.post('/admin/artists', adminController.createArtist)
    fastify.patch('/admin/artists/:artistId', adminController.updateArtist);
    fastify.delete('/admin/artists/:artistId', adminController.deleteArtist); 

    // Playlist API
    fastify.get('/admin/playlists', adminController.getAllPlaylists);
    fastify.get('/playlists/:playlistId', adminController.getPlaylist);
    fastify.post('/admin/playlists', adminController.createPlaylist);
    fastify.patch('/admin/playlists/:playlistId', adminController.updatePlaylist);
    fastify.get('/admin/playlists/:playlistId', adminController.deletePlaylist);

    // Song API
    fastify.get('/admin/songs', adminController.getAllSongs);
    fastify.get('/admin/songs/:songId', adminController.getSong);
    fastify.post('/admin/songs', adminController.createSong);
    fastify.patch('/admin/songs/:songId', adminController.updateSong);
    fastify.delete('/admin/songs/:songId', adminController.deleteSong);
}

module.exports = adminRoute;