const Review = require('../models/reviewModel');

exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const newReview = new Review({
            user: req.user.id,
            rating,
            comment
        });
        const review = await newReview.save();
        await review.populate('user', 'username');
        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ date: -1 }).populate('user', 'username');
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};