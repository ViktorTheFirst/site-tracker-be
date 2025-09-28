enum Role {
  USER = 'user',
  AMIM = 'admin',
  DEV_ADMIN = 'dev-admin',
}

enum UserStatus {
  INVITED = 'invited',
  CANCELED = 'canceled',
  ACCEPTED = 'accepted',
}
interface IUser {
  id?: number;
  name?: string;
  email: string;
  password?: string;
  createdAt?: string;
  isDisabled: boolean;
  role: Role;
  allowedSiteIds: number[];
  status: UserStatus;
}

export { IUser, UserStatus, Role };
