import { fetchAllActivities } from "@/strava/fetchActivities";
import { getTimeAfterString } from "@/utils/dateTimeUtils";
import { downloadObjectAsJson } from "@/utils/downloadObjectAsJson";
import { StravaActivityRaw } from "@/utils/types";
import { User } from "@prisma/client";

export const generateCsv = async (user: User, startTime?: number) => {
  const res = await fetch(
    `/api/strava/download?file_type=csv&access_token=${user.stravaAccessToken}`
  );
  const csv = await res.json();
  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  var link = document.createElement("a");
  if (link.download !== undefined) {
    var url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "all_strava_activities.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const generateJson = async (user: User, startTime?: number) => {
  const res = await fetch(
    `/api/strava/download?file_type=json&access_token=${user.stravaAccessToken}`
  );
  const json = await res.json();
  downloadObjectAsJson(json, "all_strava_activities");
};
