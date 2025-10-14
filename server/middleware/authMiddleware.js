const ensureAdmin = (req, res, next) => {
    // We assume passport has already attached the user object to the request
    if (req.isAuthenticated() && req.user.role === 'admin') {
        // If user is authenticated and is an admin, proceed to the next middleware/route handler
        return next();
    }
    res.status(403).json({ message: 'Forbidden: Admins only' });
};

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized: Please log in' });
}


module.exports = {
    ensureAdmin,
    ensureAuthenticated
};