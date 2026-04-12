const adminController = require('../controllers/adminController');
const authentication = require('../hook/authentication');
const authorization = require('../hook/authorization');

function adminRoute(fastify, options){
    // Dashboard
    fastify.get('/admin', {preHandler: [authentication, authorization('admin')]}, adminController.getDashboard);  
    // User API
    fastify.get('/admin/users', {preHandler: [authentication, authorization('admin')]},adminController.getAllUsers);
    fastify.get('/admin/user/:userId', {preHandler: [authentication, authorization('admin')]},adminController.getUser);
    fastify.post('/admin/update/user/:userId', {preHandler: [authentication, authorization('admin')]},adminController.updateUser);
    fastify.get('/admin/delete/user/:userId', {preHandler: [authentication, authorization('admin')]}, adminController.deleteUser);

    // Artist API
    fastify.get('/admin/artists', {preHandler: [authentication, authorization('admin')]}, adminController.getAllArtists);
    fastify.get('/admin/artist/:artistId', {preHandler: [authentication, authorization('admin')]}, adminController.getArtist);
    fastify.post('/admin/create/artist', {preHandler: [authentication, authorization('admin')]}, adminController.createArtist)
    fastify.post('/admin/update/artist/:artistId', adminController.updateArtist);
    fastify.get('/admin/delete/artist/:artistId', adminController.deleteArtist); 

    // Playlist API
    fastify.get('/admin/playlists', {preHandler: [authentication, authorization('admin')]}, adminController.getAllPlaylists);
    fastify.get('/admin/playlist/:playlistId', {preHandler: [authentication, authorization('admin')]}, adminController.getPlaylist);
    fastify.post('/admin/create/playlist', {preHandler: [authentication, authorization('admin')]},  adminController.createPlaylist);
    fastify.post('/admin/update/playlist/:playlistId', {preHandler: [authentication, authorization('admin')]}, adminController.updatePlaylist);
    fastify.get('/admin/delete/playlist/:playlistId', {preHandler: [authentication, authorization('admin')]}, adminController.deletePlaylist);

    // Song API
    fastify.get('/admin/songs', {preHandler: [authentication, authorization('admin')]}, adminController.getAllSongs);
    fastify.get('/admin/song/:songId', {preHandler: [authentication, authorization('admin')]}, adminController.getSong);
    fastify.post('/admin/create/song', {preHandler: [authentication, authorization('admin')]}, adminController.createSong);
    fastify.post('/admin/update/song/:songId', {preHandler: [authentication, authorization('admin')]}, adminController.updateSong);
    fastify.get('/admin/delete/song/:songId', {preHandler: [authentication, authorization('admin')]}, adminController.deleteSong);
}

module.exports = adminRoute;