const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access Denied: Token missing' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    console.log(decoded);
    next(); 
  } catch (err) {
    
    res.status(400).json({ success: false, message: 'Invalid Token' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access Denied: Admins only' });
  }
  next(); 
};

exports.isOwnerOrAdmin = (req, res, next) => {
  const userId = req.user.id; 
  const customerId = req.params.id; 

  if (req.user.role === 'admin' || userId === customerId) {
    return next(); 
  } else {
    return res.status(403).json({ success: false, message: 'Access Denied: You are not the owner' });
  }
};