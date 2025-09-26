import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { Status } from '../interfaces/general';
import HttpError from '../utils/error';
import { UserModel } from '../models/UserModel';
import { Role, UserStatus } from '../interfaces/user';
import sendEmail from '../services/email';

const defaultPassword = process.env.DEFAULT_PASSWORD!;

const inviteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.userData || {};
    const { email, allowedSiteIds } = req.body;

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const addResult = await UserModel.add({
      password: hashedPassword,
      email,
      is_disabled: false,
      role: Role.USER,
      status: UserStatus.INVITED,
      allowedSiteIds,
    });
    console.log('INVITE USER addResult', addResult);

    if (addResult && addResult.status === Status.FAIL) {
      res.status(400).json({
        addResult,
      });
      return;
    }

    await sendEmail(
      email,
      'Initation to SiteTracker',
      'TODO: put here link to SiteTracker for the new user to login'
    );

    res.status(201).json({
      status: Status.SUCCESS,
      id: addResult,
      message: 'User was invited',
    });
  } catch (err) {
    return next(new HttpError(`Invite user failed in BE - ${err}`, 500));
  }
};

export { inviteUser };
