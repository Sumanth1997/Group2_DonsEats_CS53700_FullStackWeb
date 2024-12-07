const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token

    // If no token is provided, return 401 Unauthorized
    if (!token) return res.sendStatus(401); 

    // Verify the token
    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden if token is invalid

        req.user = user; // Attach user info to the request
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;
