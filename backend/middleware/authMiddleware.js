const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log('No token provided');
        return res.status(403).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log('Malformed token');
        return res.status(403).json({ error: 'Malformed token' });
    }

    console.log('Token extracted:', token);  // Log the token for debugging

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Token verification failed', err);
            return res.status(401).json({ error: 'Failed to authenticate token' });
        }
        req.user = decoded; // Attach decoded payload
        console.log('Decoded user:', decoded);  // Log decoded user for debugging
        next();
    });
};

module.exports = { verifyJWT };
