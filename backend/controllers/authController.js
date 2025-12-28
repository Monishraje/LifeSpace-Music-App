const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ msg: 'User with this email or username already exists' });
        }

        user = new User({
            username,
            email,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: 360000,
            },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: 360000,
            },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (username) user.username = username;
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser.id !== user.id) {
                return res.status(400).json({ msg: 'Email already in use' });
            }
            user.email = email;
        }
        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({ username: user.username, email: user.email });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getMe = async (req, res) => {
    try {
        // Don't send password back
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ msg: 'Account deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.changeRole = async (req, res) => {
    try {
        const requester = await User.findById(req.user.id);
        if (requester.role !== 'owner') {
            return res.status(403).json({ msg: 'Not authorized. Only Owner can change roles.' });
        }

        const { username, newRole } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.role = newRole;
        await user.save();
        res.json({ msg: `User ${username} role updated to ${newRole}` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (currentUser.id === userToFollow.id) {
            return res.status(400).json({ msg: 'You cannot follow yourself' });
        }

        const isFollowing = currentUser.following.some(id => id.toString() === userToFollow.id);

        if (isFollowing) {
            // Unfollow
            currentUser.following = currentUser.following.filter(id => id.toString() !== userToFollow.id);
            userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== currentUser.id);
        } else {
            // Follow
            currentUser.following.push(userToFollow.id);
            userToFollow.followers.push(currentUser.id);
            // In a full implementation, a notification would be created here.
        }

        await currentUser.save();
        await userToFollow.save();

        res.json({ following: currentUser.following });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.blockUser = async (req, res) => {
    try {
        const userToBlock = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToBlock) return res.status(404).json({ msg: 'User not found' });

        if (!currentUser.blockedUsers.includes(req.params.id)) {
            currentUser.blockedUsers.push(req.params.id);
            // Unfollow if blocked
            currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
            userToBlock.followers = userToBlock.followers.filter(id => id.toString() !== req.user.id);
            
            await userToBlock.save();
            await currentUser.save();
        }
        res.json(currentUser.blockedUsers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.unblockUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        currentUser.blockedUsers = currentUser.blockedUsers.filter(id => id.toString() !== req.params.id);
        await currentUser.save();
        res.json(currentUser.blockedUsers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getBlockedUsers = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('blockedUsers', 'username');
        res.json(user.blockedUsers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.reportUser = async (req, res) => {
    try {
        console.log(`Report for user ${req.params.id}: ${req.body.reason} by user ${req.user.id}`);
        res.json({ msg: 'User reported successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
