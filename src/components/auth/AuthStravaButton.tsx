"use client";
import { handleAuthRedirect } from "@/strava/AuthFunctions";
import React from "react";

type Props = {
  user_id: string;
};

const AuthStravaButton = ({ user_id }: Props) => {
  return (
    <button className="btn" onClick={() => handleAuthRedirect(user_id)}>
      Authorize Strava
    </button>
  );
};

export default AuthStravaButton;
