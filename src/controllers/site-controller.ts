import { NextFunction, Request, Response } from 'express';

import { Status } from '../interfaces/general';
import HttpError from '../utils/error';
import { SiteModel } from '../models/SiteModel';

const addSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, email } = req.userData || {};
    //const user_id = 1;
    //const email = 'test2@email.com';

    const addResult = await SiteModel.add({ ...req.body, user_id, email });

    res.status(200).json({
      status: Status.SUCCESS,
      id: addResult,
      message: 'Site added',
    });
  } catch (err) {
    return next(new HttpError(`Login failed - ${err}`, 500));
  }
};

export { addSite };
