interface IUser {
  id?: number;
  name?: string;
  email: string;
  password?: string;
  is_disabled: boolean;
}

export { IUser };
