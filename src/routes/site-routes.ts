import { Router } from 'express';

import { addSite } from '../controllers/site-controller';
import verifyAuthCookie from '../middleware/check-cookie-auth';

const router = Router();

router.post('/', verifyAuthCookie, addSite);

export default router;
