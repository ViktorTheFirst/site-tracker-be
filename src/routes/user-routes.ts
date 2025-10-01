import { Router } from 'express';

import {
  getAllUsers,
  inviteUser,
  editUser,
} from '../controllers/user-controller';
import verifyAuthCookie from '../middleware/check-cookie-auth';

const router = Router();

router.get('/', verifyAuthCookie, getAllUsers);

router.post('/invite', verifyAuthCookie, inviteUser);

router.post('/edit-user', verifyAuthCookie, editUser);

export default router;
