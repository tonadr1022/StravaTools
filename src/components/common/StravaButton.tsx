"use client";
import Image from "next/image";
import Button from "./Button";

type Props = {};

const StravaButton = (props: Props) => {
  return (
    <Button
      onClick={() =>
        (window.location.href = "https://www.strava.com/dashboard")
      }
      className="btn-outline w-56">
      Strava
      <Image
        src="/strava_logo_2.svg"
        alt="Strava Logo"
        width={24}
        height={24}
      />
    </Button>
  );
};

export default StravaButton;
