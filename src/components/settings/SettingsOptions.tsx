"use client";
import React, { useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { SettingsFields } from "@/utils/types";
import { updateSettings } from "@/clientApi/settingsApi";

type Props = {
  settings: SettingsFields;
};

const SettingsOptions = ({ settings }: Props) => {
  const [addEmail, setAddEmail] = React.useState<string>("");
  const [addEmailOpen, setAddEmailOpen] = React.useState<boolean>(false);
  const [emailRecipients, setEmailRecipients] = React.useState<string[]>([]);
  let {
    id,
    emailRecipients: initialEmailRecipients,
    emailSubject,
    includeDateInSubject,
    decimalsToRoundMiles,
    mileageRoundThreshold,
  } = settings;

  useEffect(() => {
    setEmailRecipients(initialEmailRecipients);
  }, [initialEmailRecipients]);

  const handleAddEmailSave = async () => {
    setAddEmailOpen(false);
    try {
      setEmailRecipients([...emailRecipients, addEmail]);
      await updateSettings({
        id,
        emailRecipients: [...emailRecipients, addEmail],
      });
    } catch (e) {
      setEmailRecipients(emailRecipients.slice(0, -1));
    }
    setAddEmail("");
  };

  const handleRecipientDelete = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const email = e.currentTarget.parentElement?.firstChild?.textContent;
    if (!email) return;
    try {
      setEmailRecipients(emailRecipients.filter((e) => e !== email));
      await updateSettings({
        id,
        emailRecipients: emailRecipients.filter((e) => e !== email),
      });
    } catch (e) {
      setEmailRecipients([...emailRecipients, email]);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl">Email Recipients</div>
      {emailRecipients.map((email, i) => (
        <div
          className="flex outline rounded-lg p-2 place-items-center w-80"
          key={i}>
          <p className="flex-1">{email}</p>
          <button
            onClick={handleRecipientDelete}
            className="btn btn-error btn-outline px-2 py-0">
            <AiOutlineDelete className="w-5 h-5" />
          </button>
        </div>
      ))}
      <button
        className={`btn btn-sm btn-outline ${
          addEmailOpen ? "btn-error" : "btn-accent"
        } w-1/2 self-center`}
        onClick={() => setAddEmailOpen(!addEmailOpen)}>
        {!addEmailOpen ? "Add Email" : "Cancel"}
      </button>
      {addEmailOpen && (
        <div className="flex gap-2">
          <input
            type="text"
            className="input input-bordered flex-1"
            value={addEmail}
            placeholder="Email Address"
            onChange={(e) => setAddEmail(e.target.value)}
          />
          <button
            className="btn btn-outline btn-success"
            onClick={handleAddEmailSave}>
            Add
          </button>
        </div>
      )}
      <input
        type="text"
        className="input input-bordered"
        placeholder="Email Subject Line"
        // value={emailSubject}
      />
    </div>
  );
};

export default SettingsOptions;
