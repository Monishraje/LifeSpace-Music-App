const Playlist = require('../models/playlistModel');

exports.getStats = async (req, res) => {
    try {
        // Using the "Recently Played" playlist as the source for stats
        const historyPlaylist = await Playlist.findOne({ name: 'Recently Played', createdBy: req.user.id })
            .populate({
                path: 'songs',
                populate: {
                    path: 'uploadedBy',
                    select: 'username'
                }
            });

        if (!historyPlaylist || historyPlaylist.songs.length === 0) {
            return res.json({ topGenres: [], topArtists: [] });
        }

        const genreCounts = {};
        const artistCounts = {};

        historyPlaylist.songs.forEach(song => {
            if (song.genre && song.genre !== 'Unknown') {
                genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1;
            }
            if (song.artist) {
                artistCounts[song.artist] = (artistCounts[song.artist] || 0) + 1;
            }
        });

        const topGenres = Object.entries(genreCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        const topArtists = Object.entries(artistCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        res.json({ topGenres, topArtists });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};