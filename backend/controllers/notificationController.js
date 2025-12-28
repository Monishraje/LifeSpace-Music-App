const Notification = require('../models/notificationModel');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ date: -1 })
            .populate('sender', 'username')
            .limit(20);
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.markRead = async (req, res) => {
    try {
        await Notification.updateMany({ recipient: req.user.id, read: false }, { read: true });
        res.json({ msg: 'Notifications marked as read' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};