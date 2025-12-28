const Song = require('../models/songModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.upload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'video',
        });

        // Remove file from local uploads folder after Cloudinary upload
        fs.unlinkSync(req.file.path);

        const newSong = new Song({
            title: req.body.title,
            artist: req.body.artist,
            url: result.secure_url,
            duration: result.duration,
            public_id: result.public_id,
            uploadedBy: req.user.id,
            lyrics: req.body.lyrics || '',
            genre: req.body.genre || 'Unknown',
            mood: req.body.mood || 'Neutral',
        });

        const song = await newSong.save();

        // Create notifications for followers
        const user = await User.findById(req.user.id);
        if (user && user.followers && user.followers.length > 0) {
            const notifications = user.followers.map(followerId => ({
                recipient: followerId,
                sender: req.user.id,
                type: 'upload',
                relatedId: song._id,
                message: `${user.username} uploaded a new song: ${song.title}`
            }));
            
            await Notification.insertMany(notifications);
        }

        res.json(song);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getSongsByMood = async (req, res) => {
    try {
        const songs = await Song.find({ mood: req.params.mood }).populate('uploadedBy', 'username isVerified');
        res.json(songs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getFeed = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const songs = await Song.find({ uploadedBy: { $in: currentUser.following } })
            .sort({ date: -1 })
            .populate('uploadedBy', 'username isVerified')
            .limit(50);
        res.json(songs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find().sort({ date: -1 }).populate('uploadedBy', 'username isVerified');
        res.json(songs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.reportSong = async (req, res) => {
    try {
        // For now, we'll just log it. In a real app, save to a Report model.
        console.log(`Report for song ${req.params.id}: ${req.body.reason} by user ${req.user.id}`);
        res.json({ msg: 'Report submitted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ msg: 'Song not found' });

        if (song.uploadedBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Delete from Cloudinary
        let publicId = song.public_id;
        // Fallback: extract from URL if public_id wasn't saved
        if (!publicId && song.url) {
            const parts = song.url.split('/');
            const filename = parts[parts.length - 1];
            publicId = filename.split('.')[0];
        }

        if (publicId) {
            await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        }

        await Song.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Song removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.incrementPlays = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ msg: 'Song not found' });

        song.plays = (song.plays || 0) + 1;
        await song.save();
        res.json({ plays: song.plays });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getTrendingSongs = async (req, res) => {
    try {
        const songs = await Song.find().sort({ plays: -1 }).limit(10);
        res.json(songs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getSongsByGenre = async (req, res) => {
    try {
        const songs = await Song.find({ genre: req.params.genre }).populate('uploadedBy', 'username isVerified');
        res.json(songs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getRecentlyAdded = async (req, res) => {
    try {
        const songs = await Song.find().sort({ date: -1 }).limit(10).populate('uploadedBy', 'username isVerified');
        res.json(songs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getSongsByArtist = async (req, res) => {
    try {
        // Case-insensitive search for artist name
        const songs = await Song.find({ artist: { $regex: new RegExp('^' + req.params.artist + '$', 'i') } }).populate('uploadedBy', 'username isVerified');
        res.json(songs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
