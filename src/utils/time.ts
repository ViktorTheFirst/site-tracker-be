type SiteExpiration = {
  name: string;
  domain_exp_date: string;
  hosting_exp_date: string;
};

type ExpirationInfo = {
  site: string;
  days: number;
  type: 'domain' | 'hosting';
};

export const convertDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getIsraelDate = (): string => {
  const fullDateTime = new Date().toLocaleString('sv-SE', {
    timeZone: 'Asia/Jerusalem',
  });
  return fullDateTime.split(' ')[0];
};

export const getIsraelTime = (): string => {
  const fullDateTime = new Date().toLocaleString('sv-SE', {
    timeZone: 'Asia/Jerusalem',
  });
  return fullDateTime.split(' ')[1];
};

export const getSundayOfWeek = (inputDate: string | Date): string => {
  const date = new Date(inputDate);
  const dayOfWeek = date.getDay();
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - dayOfWeek);
  return sunday.toISOString().split('T')[0];
};

export const convertSlotTimeToTime = (slotTime: string): string => {
  const [start] = slotTime.split('-');
  const hour = parseInt(start, 10);
  return `${hour.toString().padStart(2, '0')}:00:00`;
};

export const convertDateFromGrow = (dateStr: string): string => {
  const [day, month, year] = dateStr.split('/');
  const fullYear = year.length === 2 ? `20${year}` : year;
  return `${fullYear}-${month}-${day}`;
};

export const daysUntil = (dateString: string): number => {
  const today = new Date();
  const targetDate = new Date(dateString);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const addDaysToDate = (
  dateString: string,
  daysToAdd: number
): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + daysToAdd);
  return convertDateToString(date);
};

export const addHoursToTime = (
  timeString: string,
  hoursToAdd: number
): string => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds);
  date.setHours(date.getHours() + hoursToAdd);
  return date.toTimeString().split(' ')[0];
};

export const isSaturday = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date.getDay() === 6;
};

export const isWorkingDay = (dateString: string): boolean => {
  const sunday = getSundayOfWeek(dateString);
  if (isSaturday(dateString)) return false;
  return addDaysToDate(sunday, 21) !== dateString;
};
