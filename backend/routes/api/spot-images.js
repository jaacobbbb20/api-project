const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage } = require('../../db/models');

const router = express.Router();

// Delete an existing image for a spot (DONE BY MIKE MUNGIN)
router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const userId = req.user.id;

    try {
        // Find the image by ID
        const image = await SpotImage.findByPk(imageId);

        if (!image) {
            return res.status(404).json({ message: "Spot image couldn't be found" });
        }

        // Find the spot associated with the image
        const spot = await Spot.findByPk(image.spotId);

        // Check if the current user is the owner of the spot
        if (spot.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden: You are not the owner of this spot" });
        }

        // Delete the image
        await image.destroy();

        return res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;