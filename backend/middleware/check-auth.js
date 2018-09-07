const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'secret_my_first_key');
    req.userData = {email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(400).json({
      message: 'You are not authenticated!'
    });
  }
};
