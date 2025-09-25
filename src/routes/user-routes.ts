import { Router } from 'express';

import { inviteUser } from '../controllers/user-controller';
import verifyAuthCookie from '../middleware/check-cookie-auth';

const router = Router();

router.post('/invite', verifyAuthCookie, inviteUser);

export default router;
