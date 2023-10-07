import { getTimeAfterString } from "@/utils/dateTimeUtils";
import { User } from "@prisma/client";

export const fetchRecentActivities = async (user: User, numDays: number) => {
  // const response = await fetch(
  //   `http://localhost:3000/api/strava/recent_activities?num_days=${numDays}&access_token=${user.stravaAccessToken}`
  // );
  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?after=${getTimeAfterString(
      numDays
    )}`,
    {
      headers: {
        Authorization: `Bearer ${user.stravaAccessToken}`,
      },
    }
  );
  if (!response.ok) {
    console.error(response);
    throw new Error("Failed to fetch activities");
  }
  const activities = await response.json();
  return activities;
};
