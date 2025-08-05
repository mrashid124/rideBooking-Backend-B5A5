

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (err) {
     console.error('JWT verification failed:', err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: 'Forbidden: role not allowed' });
    }
    next();
  };
};




// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { envVars } from '../config/env';

// export const auth = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Unauthorized: No token provided' });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, envVars.JWT.JWT_ACCESS_SECRET);

//     // @ts-ignore: attach user info to req
//     req.user = decoded;
//     next();
//   } catch (_err) {
//     // Using "_err" avoids the ESLint unused variable warning
//     return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
//   }
// };
