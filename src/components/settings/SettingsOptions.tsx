"use client";
import React from "react";
import EmailRecipientsSetting from "./EmailRecipientsSetting";
import IncludeDateSetting from "./IncludeDateSetting";
import { Toaster } from "react-hot-toast";
import DecimalRoundSetting from "./DecimalRoundSetting";
import MileageRoundThresholdSetting from "./MileageRoundThresholdSetting";
import EmailSubjectSetting from "./EmailSubjectSetting";
import { Settings } from "@prisma/client";
import ActivityTypes from "./ActivityTypes";
type Props = {
  settings: Settings;
};

const SettingsOptions = ({ settings }: Props) => {
  let {
    id,
    emailRecipients,
    emailSubject,
    includeDateInSubject,
    digitsToRound,
    mileageRoundThreshold,
    activityTypes,
  } = settings;

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex flex-col gap-4">
        <EmailRecipientsSetting
          id={id}
          initialEmailRecipients={emailRecipients}
        />
        <IncludeDateSetting id={id} initialIncludeDate={includeDateInSubject} />
        <DecimalRoundSetting id={id} initialDecimalsToRound={digitsToRound} />
        <MileageRoundThresholdSetting
          id={id}
          initialMileageRoundThreshold={mileageRoundThreshold}
        />
        <EmailSubjectSetting id={id} initialEmailSubject={emailSubject} />
        <ActivityTypes id={id} initialActivityTypes={activityTypes} />
      </div>
    </>
  );
};

export default SettingsOptions;
