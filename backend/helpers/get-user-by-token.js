import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

// get user by jwt token
const getUserByToken = async (token) => {
  if (!token) {
    return res.status(401).json({ message: 'Acesso negado!' });
  }

  const decoded = jwt.verify(token, process.env.SECRET);

  const userId = decoded.id;

  const user = await User.findOne({ _id: userId });

  return user;
};

export default getUserByToken;
