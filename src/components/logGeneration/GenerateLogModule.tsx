"use client";
import React, { useState } from "react";
import Button from "../common/Button";
import { generateWeeklyLog } from "@/strava/GenerateWeeklyLog";
import { Settings, User } from "@prisma/client";
import { getSubjectDateRangeString, subtractDays } from "@/utils/dateTimeUtils";
import { ImCancelCircle } from "react-icons/im";
import { AiOutlineCopy, AiOutlineMail } from "react-icons/ai";
type Props = {
  user: User;
  settings: Settings;
};

const GenerateLogModule = ({ user, settings }: Props) => {
  const {
    emailSubject,
    emailRecipients,
    includeDateInSubject,
    digitsToRound,
    mileageRoundThreshold,
  } = settings;

  const [log, setLog] = useState<string>("");
  const [logLoading, setLogLoading] = useState<boolean>(false);
  const handleLogGeneration = async () => {
    setLogLoading(true);
    const activities = await generateWeeklyLog(
      user,
      digitsToRound,
      Number(mileageRoundThreshold)
    );
    setLog(activities);
    setLogLoading(false);
  };

  const sendEmail = () => {
    // let body = log + "\n\nThanks,\nTony";
    let body = log;
    const emailRecipientsString = emailRecipients.join(",");
    const fullSubject = `${emailSubject}${
      includeDateInSubject ? getSubjectDateRangeString() : ""
    }`;
    document.location.href = `mailto:${emailRecipientsString}?subject=${encodeURIComponent(
      fullSubject
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleCopy = () => {
    if (log === "") return;
    navigator.clipboard.writeText(log);
  };

  const handleClear = () => {
    setLog("");
  };

  return (
    <>
      <Button
        className="btn-outline btn-accent w-56"
        onClick={handleLogGeneration}>
        Generate Weekly Log
      </Button>
      {logLoading && (
        <span className="loading loading-spinner loading-lg self-center"></span>
      )}
      {log && (
        <div className="flex flex-col gap-8 items-center">
          <div className="flex gap-4">
            <Button
              className="btn-outline rounded-full px-2"
              onClick={handleCopy}>
              <AiOutlineCopy className="w-8 h-8" />
            </Button>
            <Button
              className="btn-outline rounded-full px-2"
              onClick={handleClear}>
              <ImCancelCircle className="w-8 h-8" />
            </Button>
            <Button
              className="btn-outline rounded-full px-2"
              onClick={sendEmail}>
              <AiOutlineMail className="w-8 h-8" />
            </Button>
          </div>
          <textarea
            onChange={(e) => setLog(e.target.value)}
            className="textarea max-w-sm textarea-bordered w-96"
            rows={14}
            value={log}
          />
        </div>
      )}
    </>
  );
};

export default GenerateLogModule;
