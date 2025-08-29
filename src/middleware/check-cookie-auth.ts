import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import pool from '../DB/db-connect';
import HttpError from '../utils/error';

const verifyAuthCookie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === 'OPTIONS') return next();

  /* const token = req.cookies?.token;

  if (!token) {
    res.clearCookie('token');
    return next(
      new HttpError('No authentication token found. Please log in.', 401)
    );
  }

  const db = await pool.getConnection();
  
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user_id = decodedToken.id;
    if (!user_id) {
      res.clearCookie('token');
      return next(new HttpError('Invalid token payload', 401));
    }

    const user = await UserModel.getUserById(Number(user_id), db);
    if (!user) {
      res.clearCookie('token');
      return next(new HttpError('User not found', 401));
    }

    if (!user.status) {
      // User is disabled! throw an error
      res.clearCookie('token');
      return next(new HttpError('ACCOUNT_DISABLED', 403));
    }

    // Attach to req.user
    req.userData = {
      user_id: user.id,
      email: user.email,
      name: user.name,
      company_id: Number(user.company_id),
      role: user.role,
    };

    next();
  } catch (err) {
    console.log('Auth middleware error:', err);
    res.clearCookie('token');
    return next(new HttpError('Not authorized, invalid token', 401));
  } finally {
    db.release()
  } */
};

export default verifyAuthCookie;
