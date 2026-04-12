const authentication = require('../hook/authentication');
const playlistPickerController = require('../controllers/playlistPickerController');

function playlistPickerRoute(fastify, options) {
    fastify.get('/song/:songId/select-playlist', { preHandler: authentication }, playlistPickerController.getSelectPlaylistPage);
    fastify.post('/song/:songId/select-playlist', { preHandler: authentication }, playlistPickerController.addSongToPlaylist);
}

module.exports = playlistPickerRoute;
