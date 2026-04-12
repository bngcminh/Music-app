const Song = require('../models/Song');
const UserPlaylist = require('../models/userPlaylist');

const getSelectPlaylistPage = async function(req, rep) {
    try {
        const songId = req.params.songId;
        const song = await Song.findById(songId).populate('artist', 'name avatar');

        if (!song) {
            return rep.code(404).send('Khong tim thay bai hat');
        }

        const playlists = await UserPlaylist.find({ user: req.user.id });

        return rep.view('select_playlist.pug', {
            song,
            playlists,
            user: req.user,
            success: req.query.success === '1'
        });
    } catch (err) {
        console.log(err);
        return rep.code(500).send('Co loi khi tai trang chon playlist');
    }
};

const addSongToPlaylist = async function(req, rep) {
    try {
        const songId = req.params.songId;
        const { playlistId } = req.body;

        const song = await Song.findById(songId);
        if (!song) {
            return rep.code(404).send('Khong tim thay bai hat');
        }

        const playlist = await UserPlaylist.findOneAndUpdate(
            { _id: playlistId, user: req.user.id },
            { $addToSet: { songs: songId } },
            { new: true }
        );

        if (!playlist) {
            return rep.code(404).send('Khong tim thay playlist');
        }

        return rep.redirect(`/song/${songId}/select-playlist?success=1`);
    } catch (err) {
        console.log(err);
        return rep.code(500).send('Co loi khi them bai hat vao playlist');
    }
};

module.exports = {
    getSelectPlaylistPage,
    addSongToPlaylist
};
