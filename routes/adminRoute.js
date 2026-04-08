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
    fastify.get('/artists/:artistId', adminController.getArtist);
    fastify.post('/admin/artists', adminController.createArtist)
    fastify.patch('/admin/artists/:artistId', adminController.updateArtist);
    fastify.get('/admin/artists/:artistId', adminController.deleteArtist); 

    // Playlist API
    fastify.get('/admin/playlists', adminController.getAllPlaylists);
    fastify.get('/playlists/:playlistId', adminController.getPlaylist);
    fastify.post('/admin/playlists', adminController.createPlaylist);
    fastify.patch('/admin/playlists/:playlistId', adminController.updatePlaylist);
    fastify.get('/admin/playlists/:playlistId', adminController.deletePlaylist);

    // Song API
    fastify.get('/admin/songs', adminController.getAllSongs);
    fastify.get('/admin/song/:songId', adminController.getSong);
    fastify.post('/admin/songs', adminController.createSong);
    fastify.post('/admin/update/:songId', adminController.updateSong);
    fastify.get('/admin/delete/:songId', adminController.deleteSong);
}

module.exports = adminRoute;