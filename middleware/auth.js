var jwt=require('jsonwebtoken');
module.exports=function verifyToken(req, res, next) {
    var bearerHeader = req.headers['authorization']; // Create token found in headers
    // Check if token was found in headers
    if (bearerHeader !== undefined) {
        var bearer = bearerHeader.split(' ');
        var bearerToken = bearer[1];
        req.token = bearerToken;
    }

    if (!bearerToken) {
        res.json({
            success: false,
            message: 'No token provided'
        }); // Return error
    } else {
        // Verify the token is valid
        jwt.verify(req.token, 'somesecretkey', (err, decoded) => {
            // Check if error is expired or invalid
            if (err) {
                res.status(403).json({
                    success: false,
                    message: 'Token invalid: ' + err
                }); // Return error for token validation
            } else {
                req.decoded = decoded; // Create global variable to use in any request beyond
                next(); // Exit middleware
            }
        });
    }
}