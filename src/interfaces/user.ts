enum Role {
  USER = 'user',
  AMIM = 'admin',
  DEV_ADMIN = 'dev-admin',
}
interface IUser {
  id?: number;
  name?: string;
  email: string;
  password?: string;
  is_disabled: boolean;
  role: Role;
}

export { IUser };
