const argon = require("argon2");
const User = require("../Model/user.model");
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
            updateData.password = await argon2.hash(req.body.password);
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

module.exports = {
    test,
    updateUser
}