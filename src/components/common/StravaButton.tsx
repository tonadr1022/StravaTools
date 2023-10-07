"use client";
import Image from "next/image";

type Props = {};

const StravaButton = (props: Props) => {
  return (
    <button
      onClick={() =>
        (window.location.href = "https://www.strava.com/dashboard")
      }
      className="bg-white rounded-lg p-2 max-w-fit">
      <Image
        src="/strava_logo.svg"
        alt="Strava Logo"
        width={200}
        height={300}
      />
    </button>
  );
};

export default StravaButton;
