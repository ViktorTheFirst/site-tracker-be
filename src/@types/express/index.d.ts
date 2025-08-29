import { UserPayload } from '../../interfaces/user';

declare global {
  namespace Express {
    interface Request {
      userData?: UserPayload;
    }
  }
}
