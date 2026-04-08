const adminController = require('../controllers/adminController');
const authentication = require('../hook/authentication');
const authorization = require('../hook/authorization');

function adminRoute(fastify, options){
    // User API
    fastify.get('/admin/users', {preHandler: [authentication, authorization('admin')]},adminController.getAllUsers);
    fastify.get('/admin/users/:userId', adminController.getUser);
    fastify.post('/admin/update/user/:userId', adminController.updateUser);
    fastify.get('/admin/delete/user/:userId', adminController.deleteUser);

    // Artist API
    fastify.get('/admin/artists', adminController.getAllArtists);
    fastify.get('/artists/:artistId', adminController.getArtist);
    fastify.post('/admin/create/artist', adminController.createArtist)
    fastify.post('/admin/update/artist/:artistId', adminController.updateArtist);
    fastify.get('/admin/delete/artist/:artistId', adminController.deleteArtist); 

    // Playlist API
    fastify.get('/admin/playlists', adminController.getAllPlaylists);
    fastify.get('/playlists/:playlistId', adminController.getPlaylist);
    fastify.post('/admin/create/playlist', adminController.createPlaylist);
    fastify.post('/admin/update/playlist/:playlistId', adminController.updatePlaylist);
    fastify.get('/admin/delete/playlist/:playlistId', adminController.deletePlaylist);

    // Song API
    fastify.get('/admin/songs', adminController.getAllSongs);
    fastify.get('/admin/song/:songId', adminController.getSong);
    fastify.post('/admin/create/song', adminController.createSong);
    fastify.post('/admin/update/song/:songId', adminController.updateSong);
    fastify.get('/admin/delete/song/:songId', adminController.deleteSong);
}

module.exports = adminRoute;