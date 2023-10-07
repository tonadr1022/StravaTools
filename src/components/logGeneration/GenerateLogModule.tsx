"use client";
import React, { useState } from "react";
import Button from "../common/Button";
import { generateWeeklyLog } from "@/strava/GenerateWeeklyLog";
import { User } from "@prisma/client";
import { subtractDays } from "@/utils/dateTimeUtils";
import { ImCancelCircle } from "react-icons/im";
import { AiOutlineCopy, AiOutlineMail } from "react-icons/ai";
type Props = {
  user: User;
};

const GenerateLogModule = ({ user }: Props) => {
  const subject = `Adriansen Training Log - ${subtractDays(
    new Date(),
    7
  ).toLocaleDateString()} to ${new Date().toLocaleDateString()}`;

  const [log, setLog] = useState<string>("");
  const [logLoading, setLogLoading] = useState<boolean>(false);
  const handleLogGeneration = async () => {
    setLogLoading(true);
    const activities = await generateWeeklyLog(user);
    setLog(activities);
    setLogLoading(false);
  };
  const sendEmail = () => {
    let body = log + "\n\nThanks,\nTony";
    // body = body.replace("\n", "%0D%0A");
    console.log(body);
    document.location.href = `mailto:MGB@athletics.wisc.edu,AAW@athletics.wisc.edu?subject=${encodeURIComponent(
      subject
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
