import { getTimeAfterString } from "@/utils/dateTimeUtils";
import { StravaActivityRaw } from "@/utils/types";
import { User } from "@prisma/client";

export const fetchActivities = async (user: User, numDaysBack?: number) => {
  const params = new URLSearchParams();

  numDaysBack &&
    params.append("after", getTimeAfterString(numDaysBack).toString());

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

  const activities: StravaActivityRaw[] = await response.json();
  return activities;
};

export const fetchAllActivities = async (user: User) => {
  try {
    let page = 1;
    const perPage = 200;
    const activities: StravaActivityRaw[] = [];
    while (true) {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("per_page", perPage.toString());

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

      const currActivities: StravaActivityRaw[] = await response.json();
      if (!currActivities || currActivities.length === 0) {
        break;
      }
      activities.push(...currActivities);
      page++;
    }
  } catch (e) {
    console.log(e);
    throw new Error("Failed to fetch activities");
  }
};
