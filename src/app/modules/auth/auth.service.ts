
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password!");
  }

  const userTokens = createUserTokens(isUserExist);

  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
};



// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { User } from '../user/user.model';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { IUser } from '../user/user.model';
// import { envVars } from '../../config/env';

// const createToken = (user: IUser) => {
//   return (jwt as any).sign(
//     { id: user._id, role: user.role },
//     envVars.JWT.JWT_ACCESS_SECRET,
//     { expiresIn: envVars.JWT.JWT_ACCESS_EXPIRES }
//   );
// };

// export const AuthService = {
//   register: async (payload: IUser) => {
//     const userExists = await User.findOne({ email: payload.email });
//     if (userExists) throw new Error('User already exists');

//     const user = new User(payload);
//     await user.save();

//     return {
//       message: 'Registration successful',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     };
//   },

//   login: async (email: string, password: string) => {
//     const user = await User.findOne({ email }).select('+password');
//     if (!user || user.isBlocked) throw new Error('Invalid credentials');

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) throw new Error('Invalid credentials');

//     const token = createToken(user);

//     return {
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     };
//   },
// };


