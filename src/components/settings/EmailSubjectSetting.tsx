import { updateSettings } from "@/clientApi/settingsApi";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

type Props = {
  id: string;
  initialEmailSubject: string;
};

const EmailSubjectSetting = ({ id, initialEmailSubject }: Props) => {
  const [emailSubject, setEmailSubject] = React.useState(initialEmailSubject);
  useEffect(() => {
    setEmailSubject(initialEmailSubject);
  }, [initialEmailSubject]);

  const handleSave = async () => {
    const oldEmailSubject = emailSubject;
    try {
      setEmailSubject(emailSubject);
      await updateSettings({
        id,
        emailSubject: emailSubject,
      });

      toast.success("Email subject updated");
    } catch (e) {
      setEmailSubject(oldEmailSubject);
      toast.error("Failed to update email subject");
    }
  };
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="label text-sm p-0">Email Subject</div>
      <div className="flex flex-col gap-3 place-items-center">
        <input
          type="text"
          className="input input-bordered"
          placeholder="Email Subject Line"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
        />
        {initialEmailSubject !== emailSubject && (
          <button className="btn btn-accent btn-sm" onClick={handleSave}>
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailSubjectSetting;
