import { User } from "@prisma/client";
import { fetchRecentActivities } from "./fetchActivities";
import { formatPace } from "./formatUtils";
import { checkAndRefreshStravaAuth } from "./AuthFunctions";

export type StravaActivityRaw = {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  average_speed: number;
  type: string;
  start_date: string;
};

export type StravaActivity = StravaActivityRaw & {
  duration: number;
  date: Date;
  day: number;
  formattedPace: string;
};

export type LogEntry = {
  day: string;
  totalDistance: number;
  totalDuration: number;
  averagePace: number;
  activities: StravaActivity[];
};

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

// Monday - 11mi @7:30/mi
export const generateWeeklyLog = async (user: User) => {
  await checkAndRefreshStravaAuth(user);
  let activities = await fetchRecentActivities(user, 7);
  let activityToday = false;
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

  for (const activity of activities) {
    const date = new Date(activity.start_date);
    activity.date = date;
    // check if activity occurred before or after noon
    // check if activity occurred today
    if (date.getDate() === new Date().getDate()) activityToday = true;

    activity.day = date.getDay();
    // console.log(activity.day, weekday[activity.day]);
    activitiesByDay[
      `${weekdays[activity.day]}${date.getHours() < 12 ? "AM" : "PM"}`
    ].push({
      ...activity,
      distance: activity.distance / 1609,
      duration: activity.moving_time / 60,
      average_speed: 26.8224 / activity.average_speed,
      formattedPace: formatPace(26.8224 / activity.average_speed),
    });
  }

  const weeklyLog = [];
  const orderOfDays = getOrderOfDays(activityToday);
  for (const day of orderOfDays) {
    const weekday = weekdays[day];
    const amActivities = activitiesByDay[`${weekday}AM`];
    const pmActivities = activitiesByDay[`${weekday}PM`];
    const doubleDay = amActivities.length > 0 && pmActivities.length > 0;
    let activityString = `${weekday} - `;
    if (doubleDay) {
      weeklyLog.push(
        `${activityString}AM: ${generateActivityString(
          activitiesByDay[`${weekday}AM`]
        )}, PM: ${generateActivityString(activitiesByDay[`${weekday}PM`])}`
      );
    } else if (activitiesByDay[`${weekday}AM`].length > 0) {
      weeklyLog.push(
        `${weekday} - ${generateActivityString(
          activitiesByDay[`${weekday}AM`]
        )}`
      );
    } else if (activitiesByDay[`${weekday}PM`].length > 0) {
      weeklyLog.push(
        `${weekday} - ${generateActivityString(
          activitiesByDay[`${weekday}PM`]
        )}`
      );
    } else {
      weeklyLog.push(`${weekday} - Off`);
    }
  }
  weeklyLog.push(`\nTotal: ${Math.round(totalMileage)}mi.`);
  return weeklyLog.join("\n");
};

const getOrderOfDays = (activityToday: boolean): number[] => {
  let initialDay = new Date().getDay();
  if (activityToday) {
    ++initialDay;
  }
  const orderOfDays = [];
  for (let i = 0; i < 7; i++) {
    orderOfDays.push((i + initialDay) % 7);
  }
  return orderOfDays;
};
