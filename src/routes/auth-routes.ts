import { Router } from 'express';

import {
  login,
  logout,
  verifyFirstTimeToken,
} from '../controllers/auth-controller';

const router = Router();

router.post('/login', login);

router.post('/logout', logout);

router.post('/verify-token', verifyFirstTimeToken);

export default router;
