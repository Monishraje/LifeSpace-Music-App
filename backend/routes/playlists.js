const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const auth = require('../middleware/auth');

router.post('/', auth, playlistController.createPlaylist);
router.get('/public', playlistController.getPublicPlaylists);
router.get('/my', auth, playlistController.getMyPlaylists);
router.post('/like/:songId', auth, playlistController.toggleLike);
router.get('/liked', auth, playlistController.getLikedSongs);
router.post('/recently-played', auth, playlistController.addToRecentlyPlayed);
router.get('/recently-played', auth, playlistController.getRecentlyPlayed);
router.get('/daily-mix', auth, playlistController.getDailyMix);
router.get('/smart', auth, playlistController.getSmartPlaylists);
router.get('/:id', playlistController.getPlaylistById);
router.post('/:id/songs', auth, playlistController.addSongToPlaylist);
router.put('/:id', auth, playlistController.renamePlaylist);
router.delete('/:id', auth, playlistController.deletePlaylist);

module.exports = router;
