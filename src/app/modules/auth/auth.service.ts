/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../user/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../user/user.model';
import { envVars } from '../../config/env';




const createToken = (user: IUser) => {
  return (jwt as any).sign(
    { id: user._id, role: user.role },
    envVars.JWT.JWT_ACCESS_SECRET,
    { expiresIn: envVars.JWT.JWT_ACCESS_EXPIRES }
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
        email: user.email,
        role: user.role,
      },
    };
  },

  login: async (email: string, password: string) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user || user.isBlocked) throw new Error('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid credentials');

    const token = createToken(user);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },
};



// Create JWT token
// const createToken = (user: IUser): string => {
//   return jwt.sign(
//     {
//       id: user._id,
//       role: user.role,
//     },
//     envVars.JWT_ACCESS_SECRET as unknown as string, 
//     {
//       expiresIn: envVars.JWT_ACCESS_EXPIRES,
//     }
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
//         role: user.role,
//         email: user.email,
//       },
//     };
//   },

//   login: async (email: string, password: string) => {
//     const user = await User.findOne({ email }).select('+password');
//     if (!user) throw new Error('Invalid credentials');
//     if (user.isBlocked) throw new Error('User is blocked');

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) throw new Error('Invalid credentials');



//     const token = createToken(user);

//     return {
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         role: user.role,
//         email: user.email,
//       },
//     };
//   },
// };




// import { User } from '../user/user.model';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { IUser } from '../user/user.model';
// import { envVars } from '../../config/env';



// // Create JWT token
// const createToken = (user: IUser) => {
//   return jwt.sign(
//     {
//       id: user._id,
//       role: user.role,
//     },
//         envVars.JWT.JWT_ACCESS_SECRET as string,
//     // envVars.JWT_SECRET,
//     {
//               expiresIn: envVars.JWT.JWT_ACCESS_EXPIRES,
//     //   expiresIn: envVars.JWT_EXPIRES_IN,
//     }
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
//         role: user.role,
//         email: user.email,
//       },
//     };
//   },

//   login: async (email: string, password: string) => {
//     const user = await User.findOne({ email }).select('+password');
//     if (!user) throw new Error('Invalid credentials');

//     if (user.isBlocked) throw new Error('User is blocked');

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) throw new Error('Invalid credentials');

//     const token = createToken(user);

//     return {
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         role: user.role,
//         email: user.email,
//       },
//     };
//   },
// };
