"use client";
import React, { useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { updateSettings } from "@/clientApi/settingsApi";
import toast from "react-hot-toast";

type Props = {
  id: string;
  initialEmailRecipients: string[];
};

const EmailRecipientsSetting = ({ id, initialEmailRecipients }: Props) => {
  const [addEmail, setAddEmail] = React.useState<string>("");
  const [addEmailOpen, setAddEmailOpen] = React.useState<boolean>(false);
  const [emailRecipients, setEmailRecipients] = React.useState<string[]>([]);

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
      toast.success("Email recipient added");
    } catch (e) {
      setEmailRecipients(emailRecipients.slice(0, -1));
      toast.error("Failed to add email recipient");
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
      toast.success("Email recipient deleted");
    } catch (e) {
      setEmailRecipients([...emailRecipients, email]);
      toast.error("Failed to delete email recipient");
    }
  };
  return (
    <>
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
    </>
  );
};

export default EmailRecipientsSetting;
