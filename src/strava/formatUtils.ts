export const formatPace = (time: number): string => {
  // takes in minutes and decimals of minutes, convert to 00:00, minutes:seconds
  let minutes = Math.floor(time);
  let seconds = Math.round((time - minutes) * 60);
  if (seconds === 60) {
    minutes++;
    seconds = 0;
  }
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};
