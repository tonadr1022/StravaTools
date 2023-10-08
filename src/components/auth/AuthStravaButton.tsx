"use client";
import { handleAuthRedirect } from "@/strava/AuthFunctions";
import React from "react";

type Props = {
  user_id: string;
};

const AuthStravaButton = ({ user_id }: Props) => {
  return (
    <button
      className="btn btn-outline btn-accent w-1/2 self-center"
      onClick={() => handleAuthRedirect(user_id)}>
      Authorize Strava
    </button>
  );
};

export default AuthStravaButton;
