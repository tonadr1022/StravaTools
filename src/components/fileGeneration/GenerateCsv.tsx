"use client";
import { generateCsv } from "@/features/fileGeneration/generateFileFunctions";
import { getTimeAfterString } from "@/utils/dateTimeUtils";
import { User } from "@prisma/client";
import React from "react";
import toast from "react-hot-toast";

type Props = {
  user: User;
};

const GenerateCsv = ({ user }: Props) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const handleClick = async () => {
    setLoading(true);
    try {
      await generateCsv(user);
      setLoading(false);
    } catch (e) {
      toast.error("Failed to generate CSV");
    }
  };
  return loading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <button className="btn btn-outline btn-accent w-56" onClick={handleClick}>
      Generate CSV
    </button>
  );
};

export default GenerateCsv;
