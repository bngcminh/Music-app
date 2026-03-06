const adminController = require('../controllers/adminController');

function adminRoute(fastify, options){
    // User API
    fastify.get('/users', adminController.getAllUsers);
    fastify.get('/users/:userId', adminController.getUser);
    fastify.patch('/users/:userId', adminController.updateUser);
    fastify.delete('/users/:userId', adminController.deleteUser);

    // Artist API
    fastify.get('/artists', adminController.getAllArtists);
    fastify.get('/artists/:artistId', adminController.getArtist);
    fastify.post('/artists', adminController.createArtist)
    fastify.patch('/artists/:artistId', adminController.updateArtist);
    fastify.delete('/artists/:artistId', adminController.deleteArtist); 

    // Playlist API
    fastify.get('/playlists', adminController.getAllPlaylists);
    fastify.get('/playlists/:playlistId', adminController.getPlaylist);
    fastify.post('/platlists', adminController.createPlaylist);
    fastify.patch('/playlists/:playlistId', adminController.updatePlaylist);
    fastify.delete('/playlists/:playlistId', adminController.deletePlaylist);

    // Song API
    fastify.get('/songs', adminController.getAllSongs);
    fastify.get('/songs/:songId', adminController.getSong);
    fastify.post('/songs', adminController.createSong);
    fastify.patch('/songs/:songId', adminController.updateSong);
    fastify.delete('/songs/:songId', adminController.deleteSong);
}

module.exports = adminRoute;