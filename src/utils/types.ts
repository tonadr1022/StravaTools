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

export type SettingsFields = {
  id: string;
  emailRecipients: string[];
  emailSubject: string;
  includeDateInSubject: boolean;
  decimalsToRoundMiles: number;
  mileageRoundThreshold: number;
};
