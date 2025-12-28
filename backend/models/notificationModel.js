const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['upload', 'follow', 'like'], required: true },
    relatedId: { type: mongoose.Schema.Types.ObjectId }, // ID of song or playlist
    message: { type: String },
    read: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);