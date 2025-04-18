const argon = require("argon2");
const User = require("../Model/user.model");
const errorHandler = require("../Utils/error");

const singup = async (req, res, next) => {
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

module.exports = {
    singup
}