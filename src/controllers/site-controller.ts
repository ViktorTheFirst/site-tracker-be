import { NextFunction, Request, Response } from 'express';

import { Environment, Status } from '../interfaces/general';
import HttpError from '../utils/error';
import { UserModel } from '../models/UserModel';
import { SiteModel } from '../models/SiteModel';

const addSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, email } = req.userData || {};
    const {
      name,
      hostingProvider,
      hostingLogin,
      hostingPassword,
      hostingValiduntil,
      domainRegistrar,
      domainLogin,
      domainPassword,
      domainValiduntil,
      comments,
      status,
    } = req.body;

    const addResult = await SiteModel.add({ ...req.body, user_id, email });

    res.status(200).json({
      status: Status.SUCCESS,
      message: 'Site added',
    });
  } catch (err) {
    return next(new HttpError(`Login failed - ${err}`, 500));
  }
};

export { addSite };
