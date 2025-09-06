const buildLink = (token: string): string => {
  const link = `${process.env.ADMIN_DEV_URL}?token=${token}`;

  return link;
};

const formatDateForMySQL = (date: Date) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
};

const formatDateFromMySQL = (dateString: string | null | undefined) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-GB'); // en-GB → dd/mm/yyyy
};

export { formatDateForMySQL, buildLink, formatDateFromMySQL };
