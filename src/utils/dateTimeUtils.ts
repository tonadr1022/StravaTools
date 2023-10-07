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
