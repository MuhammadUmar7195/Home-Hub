const Listing = require("../Model/listing.model");

const createListing = async (req, res) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(201).json({ success: true, body: listing });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createListing
}