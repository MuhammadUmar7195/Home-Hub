const errorHandler = require("./error");
const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return next(errorHandler(401, 'Unauthorized - No token provided'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next();
    } catch (err) {
        next(errorHandler(403, 'Invalid or expired token'));
    }
};

module.exports = verifyUser;