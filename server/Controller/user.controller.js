const argon = require("argon2");
const User = require("../Model/user.model");
const ListingModel = require("../Model/listing.model");
const errorHandler = require("../Utils/error");

const test = async (req, res) => {
    res.json({ success: true, msg: "Api route test done" });
}

const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only update your own account!'));
    }
    try {
        const updateData = {
            username: req.body.username,
            email: req.body.email,
            avatar: req.body.avatar,
        };

        if (req.body.password) {
            updateData.password = await argon.hash(req.body.password);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return next(errorHandler(404, 'User not found'));
        }

        const { password, ...rest } = updatedUser._doc;

        res.status(200).json({ success: true, data: rest });
    } catch (error) {
        next(error);
    }
};


const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only delete your own account!'));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("token");
        res.status(200).json("User delete successfully");
    } catch (error) {
        next(error);
    }
}

const getUserListing = async (req, res, next) => {
    if (req.user.id === req.params.id) { // we use userRef as params to extract all listing of perticular user
        try {
            const listings = await ListingModel.find({ userRef: req.params.id.toString() });
            res.status(200).json({ success: true, body: listings });
        } catch (error) {
            next(error);
        }
    } else {
        return next(errorHandler(401, 'You can only get your own account!'));
    }
}

module.exports = {
    test,
    updateUser,
    deleteUser,
    getUserListing
}