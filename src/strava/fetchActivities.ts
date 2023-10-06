import { User } from "@prisma/client";

function getMidnightToday() {
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
}
const getTimeAfterString = (numDays: number) => {
  return (
    new Date(
      getMidnightToday().getTime() - numDays * 24 * 60 * 60 * 1000
    ).getTime() / 1000
  );
};

export const fetchRecentActivities = async (user: User, numDays: number) => {
  console.log("fetching activities");
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
  console.log("done fetching activities");
  const activities = await response.json();
  return activities;
};
