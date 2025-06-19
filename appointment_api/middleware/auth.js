const User = require('../models/User');
const { verifyToken } = require('../utils/auth');
const { AppError } = require('../utils/errors');

const authenticate = async (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) throw new AppError('No token provided', 401);
  
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    if (!user) throw new AppError('User not found', 401);
    return user;
  } catch (error) {
    throw new AppError('Invalid token', 401);
  }
};

const authorize = (roles) => (user) => {
  if (!roles.includes(user.role)) {
    throw new AppError('Insufficient permissions', 403);
  }
  return true;
};

module.exports = { authenticate, authorize };
