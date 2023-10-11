"use client";
import { User } from "@prisma/client";
import React from "react";
import dynamic from "next/dynamic";

type Props = {
  user: User;
};

const MapButton = ({ user }: Props) => {
  const ActivitiesMap = dynamic(
    () => import("@/components/maps/ActivitiesMap"), // replace '@components/map' with your component's location
    {
      loading: () => (
        <span className="loading loading-spinner loading-lg"></span>
      ),
      ssr: false, // This line is important. It's what prevents server-side render
    }
  );

  const [mapShow, setMapShow] = React.useState(false);
  const handleClick = () => {
    setMapShow(!mapShow);
  };
  return (
    <>
      <button className="btn btn-outline" onClick={handleClick}>
        {mapShow ? "Hide" : "Show"} Map
      </button>
      {mapShow && <ActivitiesMap user={user} />}
    </>
  );
};

export default MapButton;
