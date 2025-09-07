import { Router } from 'express';

import {
  addSite,
  editSite,
  getSiteById,
  getSites,
  removeSite,
} from '../controllers/site-controller';
import verifyAuthCookie from '../middleware/check-cookie-auth';

const router = Router();

router.get('/', verifyAuthCookie, getSites);

router.post('/', verifyAuthCookie, addSite);

router.get('/:id', verifyAuthCookie, getSiteById);

router.post('/edit-site', verifyAuthCookie, editSite);

router.delete('/:id', verifyAuthCookie, removeSite);

export default router;
