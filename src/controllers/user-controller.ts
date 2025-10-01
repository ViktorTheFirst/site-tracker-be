import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { Status } from '../interfaces/general';
import HttpError from '../utils/error';
import { UserModel } from '../models/UserModel';
import { IUser, Role, UserStatus } from '../interfaces/user';
import sendEmail from '../services/email';
import { buildLink, formatDateFromMySQL } from '../utils/helpers';
import { LinkPath } from '../utils/constants';

const DEFAULT_PASS = process.env.DEFAULT_PASSWORD!;
const JWT_SECRET = process.env.JWT_SECRET as string;

const inviteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.userData || {};
    const { emails, allowedSiteIds } = req.body;

    const hashedPassword = await bcrypt.hash(DEFAULT_PASS, 10);

    const addResult = await UserModel.add({
      password: hashedPassword,
      email: emails[0],
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

    const token = jwt.sign({ email: emails[0], role: Role.USER }, JWT_SECRET, {
      expiresIn: '24h',
    });

    const link = buildLink(LinkPath.FirstTimeSetup, token);

    console.log('link', link);

    await sendEmail(
      emails[0],
      'Initation to SiteTracker',
      `To complete your registration please procceed to this link: ${link}`
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

const editUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, email } = req.userData || {};
    const { name, password, email: userEmail, firstTimeSetup } = req.body;

    const existingUser = await UserModel.findByEmail(userEmail);

    if (!existingUser || !existingUser.id)
      return next(new HttpError('Error while finishing user setup', 401));

    const status = firstTimeSetup ? UserStatus.ACCEPTED : existingUser.status;

    const hashed = await bcrypt.hash(password, 10);

    const editResult = await UserModel.edit(
      existingUser.id,
      name,
      hashed,
      status
    );

    if (!editResult) {
      res.json({ status: Status.FAIL, message: 'User edit failed' });
      return;
    }

    res.status(200).json({
      status: Status.SUCCESS,
      message: 'User edited',
    });
  } catch (err) {
    return next(new HttpError(`Edit user failed in BE - ${err}`, 500));
  }
};

export { inviteUser, getAllUsers, editUser };
