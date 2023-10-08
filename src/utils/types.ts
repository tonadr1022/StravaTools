export type Map = {
  id: string;
  summary_polyline: string;
  resource_state: number;
};

export type StravaActivityRaw = {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  average_speed: number;
  sport_type: string;
  start_date: string;
  location_city: string;
  location_state: string;
  location_country: string;
  kudos_count: number;
  map: Map;
  average_cadence: number;
  average_heartrate: number;
  max_heartrate: number;
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
  digitsToRound: number;
  mileageRoundThreshold: string;
};
