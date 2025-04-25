const Listing = require("../Model/listing.model");
const errorHandler = require("../Utils/error");

const createListing = async (req, res) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(201).json({ success: true, body: listing });
    } catch (error) {
        next(error);
    }
}

const deleteListing = async (req, res, next) => {
    const listing2 = await Listing.findById(req.params.id);

    if (!listing2) {
        return next(errorHandler(404, "Listing not found."));
    }

    if (req.user.id !== listing2.userRef) {
        return next(errorHandler(401, "You can only delete your own listing"));
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("You deleted list successfully!");
    } catch (error) {
        next(error);
    }
}

const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, "Listing not found"));
    }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, "You can only update your own listings"));
    }
    try {
        const updateListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json({ success: true, body: updateListing });
    } catch (error) {
        next(error);
    }
}

const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }
        res.status(200).json({ success: true, body: listing });
    } catch (error) {
        next(error);
    }

}

const getListings = async (req, res, next) => { }

module.exports = {
    createListing,
    deleteListing,
    updateListing,
    getListing,
    getListings
}