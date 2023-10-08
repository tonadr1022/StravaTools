"use client";
import { generateCsv } from "@/features/fileGeneration/generateCsv";
import { getTimeAfterString } from "@/utils/dateTimeUtils";
import { User } from "@prisma/client";
import React from "react";

type Props = {
  user: User;
};

const GenerateCsv = ({ user }: Props) => {
  return (
    <button
      className="btn btn-outline btn-accent w-56"
      onClick={() => generateCsv(user, getTimeAfterString(365))}>
      Generate CSV
    </button>
  );
};

export default GenerateCsv;
