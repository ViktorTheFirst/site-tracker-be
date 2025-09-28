import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { Status } from '../interfaces/general';
import HttpError from '../utils/error';
import { UserModel } from '../models/UserModel';
import { IUser, Role, UserStatus } from '../interfaces/user';
import sendEmail from '../services/email';
import { formatDateFromMySQL } from '../utils/helpers';

const defaultPassword = process.env.DEFAULT_PASSWORD!;

const inviteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.userData || {};
    const { email, allowedSiteIds } = req.body;

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const addResult = await UserModel.add({
      password: hashedPassword,
      email,
      isDisabled: false,
      role: Role.USER,
      status: UserStatus.INVITED,
      allowedSiteIds,
    });
    console.log('INVITE USER addResult', addResult);

    if (addResult && addResult.status === Status.FAIL) {
      res.status(400).json(addResult);
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

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, email } = req.userData || {};

    const users = await UserModel.get();

    if (!users) {
      return res.json({
        status: Status.FAIL,
        data: null,
      });
    }

    const formattedUsers: IUser[] = users?.map((user: any) => ({
      name: user.name,
      email: user.email,
      createdAt: formatDateFromMySQL(user.created_at),
      isDisabled: !!user.is_disabled,
      role: user.role,
      allowedSiteIds: user.allowed_site_ids,
      status: user.status,
    }));

    res.status(200).json({
      status: Status.SUCCESS,
      data: formattedUsers,
    });
  } catch (err) {
    return next(new HttpError(`Getting sites failed in BE - ${err}`, 500));
  }
};

export { inviteUser, getAllUsers };
