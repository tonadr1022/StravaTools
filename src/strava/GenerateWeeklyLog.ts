import { User } from "@prisma/client";
import { fetchRecentActivities } from "./fetchActivities";
import { formatPace } from "./formatUtils";
import { checkAndRefreshStravaAuth } from "./AuthFunctions";
import { StravaActivity, StravaActivityRaw } from "@/utils/types";
import { subtractDays } from "@/utils/dateTimeUtils";

const weekdays: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const generateActivityString = (activities: StravaActivity[]): string => {
  if (activities.length === 0) return "Off";
  if (activities.length === 1) {
    const activity = activities[0];
    let ret = `${Math.round(activity.distance)}mi`;
    if (activity?.formattedPace) {
      ret += ` @${activity.formattedPace}/mi`;
    }
    return ret;
  } else {
    const totalDistance = calcTotalMileage(activities);
    const totalDuration = activities.reduce(
      (acc, curr) => acc + curr.duration,
      0
    );
    const averagePace = totalDuration / totalDistance;
    return `${Math.round(totalDistance)} total mi @${formatPace(
      averagePace
    )}/mi`;
  }
};

const calcTotalMileage = (activities: StravaActivity[]): number => {
  return activities.reduce((acc, curr) => acc + curr.distance, 0);
};

const getIsAnActivityToday = (activities: StravaActivity[]) => {
  return (
    new Date(activities[activities.length - 1].start_date).getDate() ===
    new Date().getDate()
  );
};

const filterActivitiesToFormat = (
  activities: StravaActivity[],
  activityToday: boolean
) => {
  activities = activities.filter(
    (a: StravaActivityRaw) => a.sport_type === "Run"
  );

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

export const generateWeeklyLog = async (user: User) => {
  await checkAndRefreshStravaAuth(user);
  let activities = await fetchRecentActivities(user, 7);
  if (!activities) return "No activities found";
  const isAnActivityToday = getIsAnActivityToday(activities);
  activities = filterActivitiesToFormat(activities, isAnActivityToday);
  const formattedActivities = activities.map(formatActivity);

  const totalMileage = Math.round(calcTotalMileage(activities) / 1609);

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
          amActivities
        )}, PM: ${generateActivityString(pmActivities)}`
      );
    } else if (activitiesByDay[`${weekday}AM`].length > 0) {
      weeklyLog.push(`${weekday} - ${generateActivityString(amActivities)}`);
    } else if (pmActivities.length > 0) {
      weeklyLog.push(`${weekday} - ${generateActivityString(pmActivities)}`);
    } else {
      weeklyLog.push(`${weekday} - Off`);
    }
  }

  weeklyLog.push(`\nTotal: ${Math.round(totalMileage)}mi.`);
  return weeklyLog.join("\n");
};
