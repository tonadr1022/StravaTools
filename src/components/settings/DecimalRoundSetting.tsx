import { updateSettings } from "@/clientApi/settingsApi";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

type Props = {
  id: string;
  initialDecimalsToRound: number;
};
const options = [0, 1, 2];

const DecimalRoundSetting = ({ id, initialDecimalsToRound }: Props) => {
  const [decimalsToRound, setDecimalsToRound] = React.useState<number>(0);

  useEffect(() => {
    setDecimalsToRound(initialDecimalsToRound);
  }, [initialDecimalsToRound]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const oldDecimalsToRound = decimalsToRound;
    const newDecimalsToRound = Number(e.target.value);
    try {
      console.log(newDecimalsToRound);
      setDecimalsToRound(newDecimalsToRound);
      await updateSettings({
        id,
        digitsToRound: newDecimalsToRound,
      });
      toast.success("Decimals to round setting updated");
    } catch (e) {
      setDecimalsToRound(oldDecimalsToRound);
      toast.error("Failed to update decimals to round setting");
    }
  };
  // console.log("init,", initialDecimalsToRound);

  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <div className="label text-sm p-0">Digits to Round Mileage</div>
        <div className="flex">
          {options.map((option) => {
            return (
              <label key={option} className="cursor-pointer label">
                <span className="label-text pr-2">{option}</span>
                <input
                  type="radio"
                  className="radio radio-accent"
                  name="decimalRound"
                  value={option}
                  checked={decimalsToRound == option}
                  onChange={handleChange}
                />
              </label>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DecimalRoundSetting;
