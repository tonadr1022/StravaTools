import { ActivityType, User } from "@prisma/client";
import { fetchActivities } from "./fetchActivities";
import { formatPace } from "../utils/formatUtils";
// import { checkAndRefreshStravaAuth } from "./AuthFunctions";
import { StravaActivity, StravaActivityRaw } from "@/utils/types";
import { subtractDays } from "@/utils/dateTimeUtils";
import { fetchSettings } from "@/clientApi/settingsApi";

const weekdays: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const generateActivityString = (
  activities: StravaActivity[],
  digitsToRound: number,
  mileageRoundThreshold: number
): string => {
  if (activities.length === 0) return "Off";
  if (activities.length === 1) {
    const activity = activities[0];

    let ret = `${roundMileage(
      activity.distance,
      digitsToRound,
      mileageRoundThreshold
    )}mi`;
    if (activity.sport_type === ActivityType.Run) {
      if (activity?.formattedPace) {
        ret += ` @${activity.formattedPace}/mi`;
      }
    } else {
      ret = `${Math.round(activity.duration)}min bike, ${ret}`;
    }

    return ret;
  } else {
    const totalDistance = calcTotalDistanceMiles(
      activities,
      digitsToRound,
      mileageRoundThreshold
    );
    const totalDuration = activities.reduce(
      (acc, curr) => acc + curr.duration,
      0
    );
    const averagePace = totalDuration / totalDistance;
    return `${roundMileage(
      totalDistance,
      digitsToRound,
      mileageRoundThreshold
    )} total mi @${formatPace(averagePace)}/mi`;
  }
};

const calcTotalDistanceMiles = (
  activities: StravaActivityRaw[],
  digitsToRound: number,
  mileageRoundThreshold: number
): number => {
  return activities.reduce((acc, curr) => {
    return (
      acc +
      roundMileage(curr.distance / 1609, digitsToRound, mileageRoundThreshold)
    );
  }, 0);
};

const getIsAnActivityToday = (activities: StravaActivityRaw[]) => {
  return (
    new Date(activities[activities.length - 1].start_date).getDate() ===
    new Date().getDate()
  );
};

const filterActivitiesToFormat = (
  activities: StravaActivityRaw[],
  activityToday: boolean,
  activityTypes: ActivityType[]
) => {
  activities = activities.filter((a: StravaActivityRaw) =>
    activityTypes.includes(a.sport_type as ActivityType)
  );
  if (activities.length === 0) return activities;
  const dateSevenDaysAgo = subtractDays(new Date(), 7).getDate();

  // if an activity occurred today, filter out the activities
  // that occurred on the same day last week
  if (activityToday) {
    activities = activities.filter((a: StravaActivityRaw) => {
      return new Date(a.start_date).getDate() !== dateSevenDaysAgo;
    });
  }
  return activities;
};

const formatActivity = (activity: StravaActivityRaw): StravaActivity => {
  const activityDate = new Date(activity.start_date);
  return {
    ...activity,
    date: activityDate,
    distance: activity.distance / 1609,
    duration: activity.moving_time / 60,
    average_speed: 26.8224 / activity.average_speed,
    formattedPace: formatPace(26.8224 / activity.average_speed),
  };
};

const getOrderOfDays = (isAnActivityToday: boolean): number[] => {
  let initialDay = new Date().getDay();
  if (isAnActivityToday) {
    ++initialDay;
  }

  const orderOfDays = [];
  for (let i = 0; i < 7; i++) {
    orderOfDays.push((i + initialDay) % 7);
  }
  return orderOfDays;
};

const roundMileage = (
  mileage: number,
  digitsToRound: number,
  mileageRoundThreshold: number
) => {
  if (mileage % 1 > mileageRoundThreshold) {
    return Math.ceil(mileage * 10 ** digitsToRound) / 10 ** digitsToRound;
  } else {
    return Math.floor(mileage * 10 ** digitsToRound) / 10 ** digitsToRound;
  }
};

export const generateWeeklyLog = async (user: User) => {
  let [activities, settings] = await Promise.all([
    fetchActivities(user, 7),
    fetchSettings(user.id),
  ]);

  if (!activities || activities.length === 0) return "No activities found";
  if (!settings) return "No settings found";

  const { activityTypes, digitsToRound } = settings;
  const mileageRoundThreshold = Number(settings.mileageRoundThreshold);
  const isAnActivityToday = getIsAnActivityToday(activities);

  activities = filterActivitiesToFormat(
    activities,
    isAnActivityToday,
    activityTypes
  );
  if (activities.length === 0)
    return `No activities of types ${activityTypes} found`;

  const formattedActivities = activities.map(formatActivity);

  const activitiesByDay: Record<string, StravaActivity[]> = {
    MondayAM: [],
    TuesdayAM: [],
    WednesdayAM: [],
    ThursdayAM: [],
    FridayAM: [],
    SaturdayAM: [],
    SundayAM: [],
    MondayPM: [],
    TuesdayPM: [],
    WednesdayPM: [],
    ThursdayPM: [],
    FridayPM: [],
    SaturdayPM: [],
    SundayPM: [],
  };

  formattedActivities.forEach((activity: StravaActivity) => {
    const isAM = activity.date.getHours() < 12;
    const timeOfDay = isAM ? "AM" : "PM";
    const dayOfWeek = weekdays[activity.date.getDay()];

    activitiesByDay[`${dayOfWeek}${timeOfDay}`].push(activity);
  });

  const weeklyLog = [];

  const orderOfDays = getOrderOfDays(isAnActivityToday);

  for (const day of orderOfDays) {
    const weekday = weekdays[day];
    const amActivities = activitiesByDay[`${weekday}AM`];
    const pmActivities = activitiesByDay[`${weekday}PM`];
    const doubleDay = amActivities.length > 0 && pmActivities.length > 0;
    let activityString = `${weekday} - `;

    if (doubleDay) {
      weeklyLog.push(
        `${activityString}AM: ${generateActivityString(
          amActivities,
          digitsToRound,
          mileageRoundThreshold
        )}, PM: ${generateActivityString(
          pmActivities,
          digitsToRound,
          mileageRoundThreshold
        )}`
      );
    } else if (activitiesByDay[`${weekday}AM`].length > 0) {
      weeklyLog.push(
        `${weekday} - ${generateActivityString(
          amActivities,
          digitsToRound,
          mileageRoundThreshold
        )}`
      );
    } else if (pmActivities.length > 0) {
      weeklyLog.push(
        `${weekday} - ${generateActivityString(
          pmActivities,
          digitsToRound,
          mileageRoundThreshold
        )}`
      );
    } else {
      weeklyLog.push(`${weekday} - Off`);
    }
  }
  // calculate total mileage for activities by type
  let totalMileageString = "\nTotal: ";
  if (activityTypes.length === 1) {
    totalMileageString += roundMileage(
      calcTotalDistanceMiles(activities, digitsToRound, mileageRoundThreshold),
      digitsToRound,
      mileageRoundThreshold
    );
  } else if (activityTypes.length === 2) {
    const bikeActivities = activities.filter(
      (activity) => activity.sport_type === ActivityType.Ride
    );
    const runActivities = activities.filter(
      (activity) => activity.sport_type === ActivityType.Run
    );
    const bikeMileage = roundMileage(
      calcTotalDistanceMiles(
        bikeActivities,
        digitsToRound,
        mileageRoundThreshold
      ),
      digitsToRound,
      mileageRoundThreshold
    );
    const runMileage = roundMileage(
      calcTotalDistanceMiles(
        runActivities,
        digitsToRound,
        mileageRoundThreshold
      ),
      digitsToRound,
      mileageRoundThreshold
    );
    totalMileageString += `${bikeMileage}mi bike, ${runMileage}mi run`;
  }

  weeklyLog.push(totalMileageString);
  return weeklyLog.join("\n");
};
