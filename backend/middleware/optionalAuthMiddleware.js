const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return next();
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        if (!token || token === "null" || token === "undefined") {
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id || decoded._id,
            ...decoded
        };
    } catch (err) {
        // Soft fail: public routes continue without req.user
        req.user = null;
    }

    next();
};
