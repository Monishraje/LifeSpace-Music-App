const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/profile', auth, authController.updateProfile);
router.get('/me', auth, authController.getMe);
router.post('/follow/:id', auth, authController.followUser);
router.post('/role', auth, authController.changeRole);

router.post('/block/:id', auth, authController.blockUser);
router.post('/unblock/:id', auth, authController.unblockUser);
router.get('/blocked', auth, authController.getBlockedUsers);
router.post('/report/:id', auth, authController.reportUser);
router.delete('/profile', auth, authController.deleteAccount);

module.exports = router;
