const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables

const verifyJWT = (req, res, next) => {
    // Extract token from HTTP-only cookie

    console.log('verifyJWT middleware executed');

    const token = req.cookies.authToken; 

    if (!token) {
        console.log('No token provided');
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Token verification failed', err);
            return res.status(401).json({ error: 'Failed to authenticate token' });
        }
        
        req.user = decoded; // Attach decoded payload (userId, etc.)
        console.log('Decoded user:', decoded);  
 
        console.log('Calling next()'); // Add this log statement
        next();
        console.log('Next() called'); //
    });
};

module.exports = { verifyJWT };
