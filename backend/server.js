require('dotenv').config();
const express = require('express');
const User = require('./models/userModel');
const bcrypt = require('bcrypt');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/songs');
const cors = require('cors');
const playlistRoutes = require('./routes/playlists');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve uploaded files (songs/images) - Assuming they are stored in 'uploads' folder
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
    console.log('Created uploads directory successfully');
}
app.use('/uploads', express.static(uploadsDir));

// Connect to database
connectDB();

// Seed Owner Account
const seedOwner = async () => {
    const ownerName = 'ManuRaje77994';
    const ownerEmail = 'gamehackerg44@gmail.com';
    const ownerPass = 'LifeSpace77994';

    try {
        // Find by username OR email to handle cases where one might have been changed manually
        let owner = await User.findOne({ $or: [{ username: ownerName }, { email: ownerEmail }] });
        
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(ownerPass, salt);
        
        if (!owner) {
            // If no user exists with that name or email, create it.
            owner = new User({ 
                username: ownerName, 
                email: ownerEmail, 
                password: password, 
                role: 'owner' 
            });
            await owner.save();
            console.log('Owner account seeded successfully');
        } else {
            // If a user exists, ensure all owner properties are correct.
            owner.username = ownerName;
            owner.email = ownerEmail;
            owner.password = password;
            owner.role = 'owner';
            await owner.save();
            console.log('Owner credentials updated/verified successfully');
        }
    } catch (err) {
        console.error('Error seeding owner:', err);
    }
};
seedOwner();

// Init middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/stats', require('./routes/stats'));

// Serve frontend for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
