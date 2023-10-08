import { getTimeAfterString } from "@/utils/dateTimeUtils";
import { User } from "@prisma/client";

export const fetchActivities = async (user: User, numDaysBack?: number) => {
  const params = new URLSearchParams();
  if (numDaysBack) {
    numDaysBack &&
      params.append("after", getTimeAfterString(numDaysBack).toString());
  }
  const response = await fetch(
    "https://www.strava.com/api/v3/athlete/activities?" + params,
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
