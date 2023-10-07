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
      className="btn-outline">
      Strava Dashboard
      <Image
        src="/strava_logo_2.svg"
        alt="Strava Logo"
        width={24}
        height={24}
      />
    </Button>
    // <button
    //   onClick={() =>
    //     (window.location.href = "https://www.strava.com/dashboard")
    //   }
    //   className="bg-white rounded-lg p-2 max-w-fit">
    //   <Image
    //     src="/strava_logo.svg"
    //     alt="Strava Logo"
    //     width={200}
    //     height={300}
    //   />
    // </button>
  );
};

export default StravaButton;
