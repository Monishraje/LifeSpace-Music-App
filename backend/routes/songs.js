const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const uploadSingle = (req, res, next) => {
    const upload = multer({ dest: path.join(__dirname, '../uploads') }).single('song');

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(400).json({ msg: err.message });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(400).json({ msg: err.message });
        }
        // Everything went fine.
        next();
    });
};

router.post(
    '/upload',
    auth,
    uploadSingle,
    songController.upload
);

router.get('/', songController.getAllSongs);
router.delete('/:id', auth, songController.deleteSong);

router.post('/play/:id', songController.incrementPlays);
router.get('/trending', songController.getTrendingSongs);
router.post('/report/:id', auth, songController.reportSong);
router.get('/feed', auth, songController.getFeed);
router.get('/genre/:genre', auth, songController.getSongsByGenre);
router.get('/mood/:mood', auth, songController.getSongsByMood);
router.get('/recently-added', auth, songController.getRecentlyAdded);
router.get('/artist/:artist', auth, songController.getSongsByArtist);

module.exports = router;
