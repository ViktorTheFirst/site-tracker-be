import { NextFunction, Request, Response } from 'express';
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { Environment, Status } from '../interfaces/general';
import HttpError from '../utils/error';

const JWT_SECRET = process.env.JWT_SECRET as string;

const login = async (req: Request, res: Response, next: NextFunction) => {
  /* try {
    const { email, password } = req.body;

    // Basic field validation
    if (!email || !password) {
      return next(new HttpError('Email and password are required', 400));
    }

    if (password.length < 6) {
      return next(new HttpError('Minimum password length is 6', 400));
    }

    const user = await UserModel.findByEmail(email);
    if (!user || !user.password)
      return next(new HttpError('Invalid credentials', 401));

    const match = await bcrypt.compare(password, user.password);

    if (!match) return next(new HttpError('Invalid credentials', 401));

    if (!user.status) {
      // User is disabled! throw an error
      return next(new HttpError('ACCOUNT_DISABLED', 403));
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        company_id: user.company_id!,
      },
      JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== Environment.DEV,
      sameSite: process.env.NODE_ENV !== Environment.DEV ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });


    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        company_id: user.company_id,
        role: user.role,
      }
    });
  } catch (err) {
    return next(new HttpError(`Login failed - ${err}`, 500));
  } */
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    return next(new HttpError(`changePassword failed - ${err}`, 500));
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Clear cookie
    res.cookie('token', '', {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
    });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    return next(new HttpError(`logout failed - ${err}`, 500));
  }
};

const verifyFirstTimeToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;

    if (!token) {
      res
        .status(401)
        .json({ status: Status.FAIL, message: 'Token is required' });

      return;
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    res.json({ status: Status.SUCCESS, ...decodedToken });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res
        .status(401)
        .json({ status: Status.FAIL, message: 'Token has expired' });
      return;
    } else if (err instanceof JsonWebTokenError) {
      res.status(401).json({ status: Status.FAIL, message: 'Invalid token' });
      return;
    }

    res
      .status(500)
      .json({ status: Status.FAIL, message: 'Token verification failed' });
  }
};

export { login, changePassword, logout, verifyFirstTimeToken };
