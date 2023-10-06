"use client";
import React, { useState } from "react";
import Button from "../common/Button";
import { generateWeeklyLog } from "@/strava/GenerateWeeklyLog";
import { User } from "@prisma/client";
import { subtractDays } from "@/utils/dateTimeUtils";

type Props = {
  user: User;
};
// MGB@athletics.wisc.edu
// AAW@athletics.wisc.edu
const MainPageButtons = ({ user }: Props) => {
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
    <div className="flex flex-col gap-10 min-w-full justify-ceter">
      <Button onClick={handleLogGeneration}>Generate Weekly Log</Button>
      {logLoading && (
        <span className="loading loading-spinner loading-lg self-center"></span>
      )}
      {log && (
        <div className="flex flex-col gap-8 items-center">
          <div className="flex gap-4">
            <Button onClick={handleCopy}>Copy to Clipboard</Button>
            <Button onClick={handleClear}>Clear</Button>
            <Button onClick={sendEmail}>Send Email</Button>
          </div>
          <textarea
            onChange={(e) => setLog(e.target.value)}
            className="textarea textarea-bordered w-10/12"
            rows={14}
            value={log}
          />
        </div>
      )}
      <button className="btn">Generate Activities CSV</button>
      <button className="btn">Go to Strava</button>
      <button className="btn">View Maps</button>
    </div>
  );
};

export default MainPageButtons;
