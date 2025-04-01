const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Review, ReviewImage } = require('../../db/models');

const router = express.Router();

// DELETE /api/review-images/:imageId
// Deletes a review image
router.delete(
    '/:imageId', 
    requireAuth, 
    async (req, res) => {
        const { imageId } = req.params;
        const userId = req.user.id;

        const reviewImage = await ReviewImage.findByPk(imageId, {
            include: { model: Review }
        });

        if (!reviewImage) {
            return res.status(404).json({ message: "Review Image couldn't be found" });
        }

        if (reviewImage.Review.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await reviewImage.destroy();

        return res.status(200).json({
        message: "Successfully deleted"
    });
});

module.exports = router;
