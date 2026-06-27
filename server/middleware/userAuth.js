const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authorization denied, please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'leafora_secret_key');
    req.user = decoded; // Contains id, email, firstName
    next();
  } catch (err) {
    res.status(401).json({ message: 'Session expired or token is invalid. Please log in again.' });
  }
};

module.exports = userAuth;
