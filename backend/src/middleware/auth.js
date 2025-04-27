const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
    }
    
    // Get IP address for anonymous tracking
    req.ipAddress = req.ip || 
                   req.headers['x-forwarded-for'] || 
                   req.connection.remoteAddress;
    
    next();
  } catch (error) {
    // Don't block the request if token is invalid
    next();
  }
};