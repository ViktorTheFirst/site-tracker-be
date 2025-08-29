export const buildLink = (token: string): string => {
  const link = `${process.env.ADMIN_DEV_URL}?token=${token}`;

  return link;
};
