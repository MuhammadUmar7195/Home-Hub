const argon = require("argon2");
const User = require("../Model/user.model");
const errorHandler = require("../Utils/error");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({ success: false, msg: "All fields are required" });
    }

    const hashedPassword = await argon.hash(password);
    const newUser = await User({
        username,
        email,
        password: hashedPassword
    });

    try {
        await newUser.save();
        res.status(201).json({ success: true, msg: "User created successfully." })
    } catch (error) {
        next(error);
    }
}

const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        //validate email & password (argon2)
        const user = await User.findOne({ email });
        const validatePassword = await argon.verify(user.password, password);
        if (!user) {
            next(errorHandler(404, 'User not found!'));
        }
        if (!validatePassword) {
            next(errorHandler(401, 'Password is incorrect!'));
        }
        const payload = {
            id: user._id,
            email: user.email
        }
        //sign a token for user cookie
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
        const { password: pass, ...rest } = user._doc;
        res.status(200)
            .cookie('token', token, { httpOnly: true })
            .json({ success: true, rest });
    } catch (error) {
        next(error);
    }
}

const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
            const { password: pass, ...rest } = user._doc;
            res
                .cookie('token', token, { httpOnly: true })
                .status(200)
                .json({ success: true, rest });
        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = await argon.hash(generatedPassword);
            const newUser = new User({
                username:
                    req.body.name.split(' ').join('').toLowerCase() +
                    Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res
                .cookie('token', token, { httpOnly: true })
                .status(200)
                .json({ success: true, rest });
        }
    } catch (error) {
        next(error)
    }
}

const signout = async (req, res, next) => {
    try {
        res.clearCookie('token');
        res.status(200).json('User has been logged out!');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
    signin,
    google,
    signout
}