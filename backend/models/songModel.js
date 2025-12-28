const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    url: { type: String, required: true },
    coverImage: { type: String },
    duration: { type: Number },
    public_id: { type: String },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    plays: { type: Number, default: 0 },
    lyrics: { type: String },
    genre: { type: String, default: 'Unknown' },
    mood: { type: String, default: 'Neutral' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Song', SongSchema);