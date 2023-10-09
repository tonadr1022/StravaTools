import { updateSettings } from "@/clientApi/settingsApi";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

type Props = {
  id: string;
  initialIncludeDate: boolean;
};

const IncludeDateSetting = ({ id, initialIncludeDate }: Props) => {
  const [includeDate, setIncludeDate] = React.useState<boolean>(false);

  useEffect(() => {
    setIncludeDate(initialIncludeDate);
  }, [initialIncludeDate]);

  const handleIncludeDateChange = async () => {
    try {
      setIncludeDate(!includeDate);
      await updateSettings({
        id,
        includeDateInSubject: !includeDate,
      });
      toast.success("include date updated");
    } catch (e) {
      setIncludeDate(!includeDate);
      toast.error("Failed to update include date");
    }
  };
  return (
    <label className="cursor-pointer label">
      <span className="label-text">Include Dates in Subject Line</span>
      <input
        type="checkbox"
        className="toggle toggle-accent"
        checked={includeDate}
        onChange={handleIncludeDateChange}
      />
    </label>
  );
};

export default IncludeDateSetting;
