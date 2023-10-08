import { updateSettings } from "@/clientApi/settingsApi";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

type Props = {
  id: string;
  initialMileageRoundThreshold: string;
};
const options = ["0.5", "0.7", "0.9", "0.99"];
const MileageRoundThresholdSetting = ({
  id,
  initialMileageRoundThreshold,
}: Props) => {
  const [mileageRoundThreshold, setMileageRoundThreshold] =
    React.useState<string>(initialMileageRoundThreshold);
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const oldMileageRoundThreshold = mileageRoundThreshold;

    try {
      const newMileageRoundThreshold = e.target.value;
      setMileageRoundThreshold(newMileageRoundThreshold);
      await updateSettings({
        id,
        mileageRoundThreshold: newMileageRoundThreshold,
      });
      toast.success("Mileage round threshold updated");
    } catch (e) {
      setMileageRoundThreshold(oldMileageRoundThreshold);
      toast.error("Failed to update mileage round threshold");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <div className="label text-sm p-0">Mileage Round Threshold</div>
        <div className="flex">
          {options.map((option) => (
            <label key={option} className="cursor-pointer label">
              <span className="label-text pr-2">{option}</span>
              <input
                type="radio"
                className="radio radio-accent"
                name="mileageRoundThreshold"
                value={option}
                checked={mileageRoundThreshold === option}
                onChange={handleChange}
              />
            </label>
          ))}
        </div>
      </div>
    </>
  );
};

export default MileageRoundThresholdSetting;
