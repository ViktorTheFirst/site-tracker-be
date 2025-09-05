import { Router } from 'express';

import { addSite, getSiteById } from '../controllers/site-controller';
import verifyAuthCookie from '../middleware/check-cookie-auth';

const router = Router();

router.post('/', verifyAuthCookie, addSite);

router.get('/:id', verifyAuthCookie, getSiteById);

export default router;
