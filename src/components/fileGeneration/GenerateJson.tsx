"use client";
import { generateJson } from "@/features/fileGeneration/generateFileFunctions";
import { User } from "@prisma/client";
import React from "react";
import toast from "react-hot-toast";

type Props = {
  user: User;
};

const GenerateJson = ({ user }: Props) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const handleClick = async () => {
    setLoading(true);
    try {
      await generateJson(user);
      setLoading(false);
    } catch (e) {
      toast.error("Failed to generate JSON");
    }
  };
  return loading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <button className="btn btn-outline btn-accent w-56" onClick={handleClick}>
      Generate JSON
    </button>
  );
};

export default GenerateJson;
