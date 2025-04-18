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
        const validUser = await User.findOne({ email });
        if (!validUser) {
            next(errorHandler(404, 'User not found!'));
        }
        //validate password (argon2)
        const validatePassword = await argon.verify(validUser.password, password);
        if (!validatePassword) {
            next(errorHandler(404, 'User not found!'));
        }
        const payload = { 
            email,
            password
        }
        //sign a token for user cookie
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
        const { password: pass, ...rest } = validUser._doc;
        res.status(200)
        .cookie('token', token, { httpOnly: true })
        .json({success: true, rest}); 
    } catch (error) {
        next(error);
    }
}

module.exports = {
    signup,
    signin
}