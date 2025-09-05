import { NextFunction, Request, Response } from 'express';

import { Status } from '../interfaces/general';
import HttpError from '../utils/error';
import { SiteModel } from '../models/SiteModel';

const getSiteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const site = await SiteModel.getById(Number(id));

    const formattedSite = {
      id: site?.id,
      name: site?.name,
      hostingProvider: site?.hosting_provider,
      hostingLogin: site?.hosting_login,
      hostingPassword: site?.hosting_password,
      hostingValiduntil: site?.hosting_valid_until,

      domainRegistrar: site?.domain_registrar,
      domainLogin: site?.domain_login,
      domainPassword: site?.domain_password,
      domainValiduntil: site?.domain_valid_until,

      comments: site?.comments,
      status: site?.status,
    };

    res.status(200).json({
      status: Status.SUCCESS,
      data: formattedSite,
    });
  } catch (err) {
    return next(new HttpError(`Getting site failed in BE - ${err}`, 500));
  }
};

const addSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, email } = req.userData || {};

    const addResult = await SiteModel.add({ ...req.body, user_id, email });

    res.status(200).json({
      status: Status.SUCCESS,
      id: addResult,
      message: 'Site added',
    });
  } catch (err) {
    return next(new HttpError(`Add site failed in BE - ${err}`, 500));
  }
};

export { addSite, getSiteById };
