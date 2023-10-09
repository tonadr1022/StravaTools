import { fetchActivities } from "@/strava/fetchActivities";
import { getTimeAfterString } from "@/utils/dateTimeUtils";
import { StravaActivityRaw } from "@/utils/types";
import { User } from "@prisma/client";

export const generateCsv = async (user: User, startTime: number) => {
  const activities: StravaActivityRaw[] = await fetchActivities(
    user
    // startTime
  );
  if (!activities) return "No activities found";
  console.log(activities);
};
