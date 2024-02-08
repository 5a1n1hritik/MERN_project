const jwt = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
  // const token = req.headers.authorization?.split(' ')[0]; 
  const header = req.headers['authorization'];
  console.log(header);
  if (!token) {
    return res.status(401).json({ error: 'Please authenticate using a valid token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded.user; 
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = fetchuser;
