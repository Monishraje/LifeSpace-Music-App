const Playlist = require('../models/playlistModel');
const Song = require('../models/songModel');

exports.createPlaylist = async (req, res) => {
    const { name, songs = [], isPublic = true } = req.body;

    try {
        if (!req.user) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }

        const newPlaylist = new Playlist({
            name,
            songs,
            isPublic,
            createdBy: req.user.id,
        });

        const playlist = await newPlaylist.save();
        res.json(playlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getDailyMix = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        let playlist = await Playlist.findOne({ name: 'Daily Mix', createdBy: req.user.id });

        // If playlist exists and was updated today, return it
        if (playlist && playlist.updatedAt >= startOfDay) {
            await playlist.populate('songs');
            return res.json(playlist);
        }

        // Otherwise, generate new mix
        const size = 20; // Number of songs in daily mix
        const randomSongs = await Song.aggregate([{ $sample: { size: size } }]);
        const songIds = randomSongs.map(s => s._id);

        if (playlist) {
            playlist.songs = songIds;
            // Force update timestamp (mongoose might not update if array is same, but here it likely changes)
            // We explicitly set songs, so save() will update updatedAt due to timestamps: true
        } else {
            playlist = new Playlist({
                name: 'Daily Mix',
                songs: songIds,
                isPublic: false,
                createdBy: req.user.id
            });
        }

        await playlist.save();
        // Re-fetch to populate (aggregate returns plain objects, we want full docs if needed, or just ids is fine but frontend expects objects)
        playlist = await Playlist.findById(playlist._id).populate('songs');
        
        res.json(playlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getSmartPlaylists = async (req, res) => {
    try {
        // Group songs by genre
        const genres = await Song.aggregate([
            { $group: { _id: "$genre", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.json(genres);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getPublicPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ isPublic: true }).populate(
            'createdBy',
            'username'
        );
        res.json(playlists);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getMyPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ createdBy: req.user.id });
        res.json(playlists);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.toggleLike = async (req, res) => {
    try {
        let playlist = await Playlist.findOne({ name: 'Liked Songs', createdBy: req.user.id });

        if (!playlist) {
            playlist = new Playlist({
                name: 'Liked Songs',
                songs: [],
                isPublic: false,
                createdBy: req.user.id
            });
        }

        const songId = req.params.songId;
        // Check if song exists in playlist (convert ObjectId to string for comparison)
        const index = playlist.songs.findIndex(s => s.toString() === songId);

        let isLiked = false;
        if (index > -1) {
            playlist.songs.splice(index, 1); // Remove
            isLiked = false;
        } else {
            playlist.songs.push(songId); // Add
            isLiked = true;
        }

        await playlist.save();
        res.json({ isLiked, playlist });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getLikedSongs = async (req, res) => {
    try {
        const playlist = await Playlist.findOne({ name: 'Liked Songs', createdBy: req.user.id });
        if (!playlist) return res.json([]);
        res.json(playlist.songs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.addToRecentlyPlayed = async (req, res) => {
    try {
        const { songId } = req.body;
        let playlist = await Playlist.findOne({ name: 'Recently Played', createdBy: req.user.id });

        if (!playlist) {
            playlist = new Playlist({
                name: 'Recently Played',
                songs: [],
                isPublic: false,
                createdBy: req.user.id
            });
        }

        // Remove if exists (to move to top)
        playlist.songs = playlist.songs.filter(s => s.toString() !== songId);
        // Add to beginning
        playlist.songs.unshift(songId);
        // Limit to 50 for History View
        if (playlist.songs.length > 50) {
            playlist.songs = playlist.songs.slice(0, 50);
        }

        await playlist.save();
        res.json(playlist.songs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getRecentlyPlayed = async (req, res) => {
    try {
        const playlist = await Playlist.findOne({ name: 'Recently Played', createdBy: req.user.id }).populate('songs');
        if (!playlist) return res.json([]);
        res.json(playlist.songs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.renamePlaylist = async (req, res) => {
    try {
        const { name } = req.body;
        let playlist = await Playlist.findById(req.params.id);

        if (!playlist) return res.status(404).json({ msg: 'Playlist not found' });

        if (playlist.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        playlist.name = name;
        await playlist.save();
        res.json(playlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deletePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) return res.status(404).json({ msg: 'Playlist not found' });

        if (playlist.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Playlist.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Playlist removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getPlaylistById = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id).populate('songs');
        if (!playlist) return res.status(404).json({ msg: 'Playlist not found' });
        res.json(playlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.addSongToPlaylist = async (req, res) => {
    try {
        const { songId } = req.body;
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) {
            return res.status(404).json({ msg: 'Playlist not found' });
        }

        // Collaborative Logic: Allow if creator OR if playlist is public
        if (playlist.createdBy.toString() !== req.user.id && !playlist.isPublic) {
            return res.status(401).json({ msg: 'Not authorized to add to this private playlist' });
        }

        // Check if song already exists (assuming ObjectIds in array)
        if (playlist.songs.some(s => s.toString() === songId)) {
            return res.status(400).json({ msg: 'Song already in playlist' });
        }

        playlist.songs.push(songId);
        await playlist.save();
        res.json(playlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
