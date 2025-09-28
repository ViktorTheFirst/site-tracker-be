import { Router } from 'express';

import { getAllUsers, inviteUser } from '../controllers/user-controller';
import verifyAuthCookie from '../middleware/check-cookie-auth';

const router = Router();

router.get('/', /* verifyAuthCookie, */ getAllUsers);

router.post('/invite', verifyAuthCookie, inviteUser);

export default router;
