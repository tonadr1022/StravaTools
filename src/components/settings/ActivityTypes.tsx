import { updateSettings } from "@/clientApi/settingsApi";
import { ActivityType } from "@prisma/client";
import React from "react";
import toast from "react-hot-toast";

type Props = {
  id: string;
  initialActivityTypes: ActivityType[];
};

const activityTypesList = [ActivityType.Run, ActivityType.Ride];

const ActivityTypes = ({ id, initialActivityTypes }: Props) => {
  const [activityTypes, setActivityTypes] =
    React.useState(initialActivityTypes);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: changedType } = e.target;
    const oldActivityTypes = activityTypes;
    const newActivityTypes = activityTypes.includes(changedType as ActivityType)
      ? activityTypes.filter((activityType) => activityType !== changedType)
      : [...activityTypes, changedType as ActivityType];
    try {
      setActivityTypes(newActivityTypes);
      await updateSettings({
        id,
        activityTypes: newActivityTypes,
      });
      toast.success("Activity types updated");
    } catch (e) {
      setActivityTypes(oldActivityTypes);
      console.log(e);
      toast.error("Error updating activity types");
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="label text-sm p-0">Activity Types</div>
      <div className="flex gap-1 place-items-center">
        {activityTypesList.map((activityType) => {
          return (
            <label key={activityType} className="label">
              <span className="label-text pr-2">{activityType}</span>
              <input
                key={activityType}
                type="checkbox"
                className="checkbox"
                value={activityType}
                checked={activityTypes.includes(activityType)}
                onChange={(e) => handleChange(e)}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTypes;
