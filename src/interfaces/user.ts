interface IUser {
  id?: number;
  name?: string;
  email: string;
  password?: string;
  isDisabled: boolean;
}

export { IUser };
