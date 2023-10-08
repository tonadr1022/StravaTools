export const subtractDays = (date: Date, days: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
};

export const getTimeAfterString = (numDays: number) => {
  return (
    new Date(
      getMidnightToday().getTime() - numDays * 24 * 60 * 60 * 1000
    ).getTime() / 1000
  );
};

export const getMidnightToday = () => {
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );
  return midnight;
};

export const getDateRangeString = (startDate: Date, endDate: Date) => {
  return `${startDate
    .toLocaleDateString()
    .split("/")
    .slice(0, 2)
    .join("/")} - ${endDate.toLocaleDateString()}`;
};

export const getSubjectDateRangeString = (): string => {
  const startDate = subtractDays(new Date(), 7);
  const endDate = new Date();
  return getDateRangeString(startDate, endDate);
};
