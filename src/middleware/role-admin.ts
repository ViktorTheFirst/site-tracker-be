import { Request, Response, NextFunction } from 'express';
import HttpError from '../utils/error';

const roleProtect =
  (allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.userData?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(new HttpError('Forbidden: Insufficient permissions', 403));
    }
    return next();
  };

export default roleProtect;
