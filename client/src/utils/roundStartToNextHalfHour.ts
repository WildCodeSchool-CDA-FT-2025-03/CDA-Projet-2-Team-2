export const roundStartToNextHalfHour = (isoDate: string): Date => {
  const date = new Date(isoDate);
  const minutes = date.getMinutes();

  if (minutes === 0 || minutes === 30) {
    return new Date(date);
  }

  if (minutes < 30) {
    date.setMinutes(30);
  } else {
    date.setHours(date.getHours() + 1);
    date.setMinutes(0);
  }

  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};
