export type StravaActivityRaw = {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  average_speed: number;
  sport_type: string;
  start_date: string;
};

export type StravaActivity = StravaActivityRaw & {
  duration: number;
  date: Date;
  formattedPace: string;
};
