import { User } from '../user/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../user/user.model';

const createToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const AuthService = {
  register: async (payload: IUser) => {
    const userExists = await User.findOne({ email: payload.email });
    if (userExists) throw new Error('User already exists');

    const user = new User(payload);
    await user.save();

    return {
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    };
  },

  login: async (email: string, password: string) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new Error('Invalid credentials');

    if (user.isBlocked) throw new Error('User is blocked');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid credentials');

    const token = createToken(user);
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    };
  },
};
