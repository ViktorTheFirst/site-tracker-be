import { NextFunction, Request, Response } from 'express';

import { Status } from '../interfaces/general';
import HttpError from '../utils/error';
import { SiteModel } from '../models/SiteModel';
import { formatDateFromMySQL } from '../utils/helpers';
import { UserModel } from '../models/UserModel';
import { Role } from '../interfaces/user';

const getSites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, email } = req.userData || {};

    const user = await UserModel.getUserById(user_id);

    let sites = null;

    if (user?.role === Role.USER) {
      sites = await SiteModel.getAllowedSites(user?.allowed_site_ids);
    }

    if (user?.role !== Role.USER) {
      sites = await SiteModel.getAllSites();
    }

    if (!sites) {
      return res.json({
        status: Status.FAIL,
        data: null,
      });
    }
    const formattedSites = sites.map((site) => ({
      id: site?.id,
      name: site?.name,
      hostingProvider: site?.hosting_provider,
      hostingLogin: site?.hosting_login,
      hostingPassword: site?.hosting_password,
      hostingValiduntil: formatDateFromMySQL(site?.hosting_valid_until),

      domainRegistrar: site?.domain_registrar,
      domainLogin: site?.domain_login,
      domainPassword: site?.domain_password,
      domainValiduntil: formatDateFromMySQL(site?.domain_valid_until),

      comments: site?.comments,
      status: site?.status,
      lastModifiedBy: site?.last_modified_by,
    }));

    res.status(200).json({
      status: Status.SUCCESS,
      data: formattedSites,
    });
  } catch (err) {
    return next(new HttpError(`Getting sites failed in BE - ${err}`, 500));
  }
};

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

    const addResultId = await SiteModel.add({ ...req.body, user_id, email });

    const user = await UserModel.getUserById(user_id);

    const editResult = await UserModel.edit(
      user_id,
      user.name,
      email,
      user.password,
      user.status,
      [...user.allowed_site_ids, addResultId],
      user.is_disabled
    );

    console.log('editResult in addSite', editResult);

    res.status(200).json({
      status: Status.SUCCESS,
      id: addResultId,
      message: 'Site added',
    });
  } catch (err) {
    return next(new HttpError(`Add site failed in BE - ${err}`, 500));
  }
};

const editSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, email } = req.userData || {};

    const editResult = await SiteModel.edit({ ...req.body, user_id, email });

    res.status(200).json({
      status: Status.SUCCESS,
      data: editResult,
      message: 'Site edited',
    });
  } catch (err) {
    return next(new HttpError(`Edit site failed in BE - ${err}`, 500));
  }
};

const removeSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, email } = req.userData || {};
    const { id } = req.params;

    const removeResult = await SiteModel.softRemoveSite(Number(id));

    res.status(200).json({
      status: Status.SUCCESS,
      data: removeResult,
      message: 'Site removed',
    });
  } catch (err) {
    return next(new HttpError(`Edit site failed in BE - ${err}`, 500));
  }
};

export { addSite, getSiteById, editSite, getSites, removeSite };
