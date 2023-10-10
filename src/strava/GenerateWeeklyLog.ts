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
const alternateBikeTypes = ["VirtualRide", "EBikeRide"];

const generateActivityString = (
  activities: StravaActivity[],
  digitsToRound: number,
  mileageRoundThreshold: number
): string => {
  if (activities.length === 0) return "Off";
  if (activities.length === 1) {
    const activity = activities[0];

    let ret = "";

    // add distance if it exists
    if (activity.distance) {
      ret += `${roundMileage(
        activity.distance,
        digitsToRound,
        mileageRoundThreshold
      )}mi`;
    }

    // add pace in min/mi if run
    if (activity.sport_type === ActivityType.Run) {
      if (activity?.formattedPace) {
        ret += ` @${activity.formattedPace}/mi`;
      }

      // otherwise add bike duration since its a bike activity
    } else {
      ret = `${Math.round(activity.duration)}min bike, ${ret}`;
    }

    return ret;

    // if there are multiple activities, calculate total distance and average pace
  } else {
    const runActivities = activities.filter(
      (a) => a.sport_type === ActivityType.Run
    );
    const bikeActivities = activities.filter(
      (a) =>
        a.sport_type === ActivityType.Ride ||
        alternateBikeTypes.includes(a.sport_type)
    );
    console.log(runActivities, bikeActivities);
    const totalRunDistanceRounded = calcTotalDistance(
      runActivities,
      digitsToRound,
      mileageRoundThreshold,
      true
    );
    const totalRunDistance = calcTotalDistance(
      runActivities,
      6,
      mileageRoundThreshold,
      true,
      false
    );
    const totalBikeDistance = calcTotalDistance(
      bikeActivities,
      digitsToRound,
      mileageRoundThreshold,
      true
    );
    const totalRunDuration = runActivities.reduce(
      (acc, curr) => curr.duration && acc + curr.duration,
      0
    );
    const totalBikeDuration = bikeActivities.reduce(
      (acc, curr) => curr.duration && acc + curr.duration,
      0
    );

    console.log({ activities });

    let ret = "";
    if (totalRunDistanceRounded > 0) {
      ret += `${totalRunDistanceRounded}mi`;
    }
    if (totalRunDistance > 0 && totalRunDuration > 0) {
      ret += ` @${formatPace(totalRunDuration / totalRunDistance)}/mi`;
    }
    if (totalBikeDistance > 0) {
      ret += `${totalBikeDistance > 0 ? ", " : ""}${Math.round(
        totalBikeDuration
      )}min bike, ${roundMileage(
        totalBikeDistance,
        digitsToRound,
        mileageRoundThreshold
      )}mi`;
    }
    console.log(
      totalRunDistance,
      totalRunDuration,
      totalBikeDistance,
      totalBikeDuration
    );
    console.log({ ret });
    if (!ret) return "Off";
    return ret;
  }
};

const calcTotalDistance = (
  activities: StravaActivityRaw[],
  digitsToRound: number,
  mileageRoundThreshold: number,
  alreadyInMiles: boolean = false,
  round: boolean = true
): number => {
  return activities.reduce((acc, curr) => {
    if (!curr.distance) return acc;
    const distance = alreadyInMiles ? curr.distance : curr.distance / 1609;
    if (!round) return acc + distance;
    return acc + roundMileage(distance, digitsToRound, mileageRoundThreshold);
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
  // filter by activity type
  activities = activities.filter(
    (a: StravaActivityRaw) =>
      activityTypes.includes(a.sport_type as ActivityType) ||
      alternateBikeTypes.includes(a.sport_type)
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
  if (mileage < 0.1) {
    return 0;
  } else if (mileage % 1 > mileageRoundThreshold) {
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
    totalMileageString += `${roundMileage(
      calcTotalDistance(
        activities,
        digitsToRound,
        mileageRoundThreshold,
        false
      ),
      digitsToRound,
      mileageRoundThreshold
    )}mi`;
  } else if (activityTypes.length === 2) {
    const bikeActivities = activities.filter(
      (activity) =>
        activity.sport_type === ActivityType.Ride ||
        alternateBikeTypes.includes(activity.sport_type)
    );
    const runActivities = activities.filter(
      (activity) => activity.sport_type === ActivityType.Run
    );
    const bikeMileage = roundMileage(
      calcTotalDistance(
        bikeActivities,
        digitsToRound,
        mileageRoundThreshold,
        false
      ),
      digitsToRound,
      mileageRoundThreshold
    );
    const runMileage = roundMileage(
      calcTotalDistance(
        runActivities,
        digitsToRound,
        mileageRoundThreshold,
        false
      ),
      digitsToRound,
      mileageRoundThreshold
    );
    totalMileageString += `${bikeMileage}mi bike, ${runMileage}mi run`;
  }

  weeklyLog.push(totalMileageString);
  return weeklyLog.join("\n");
};
