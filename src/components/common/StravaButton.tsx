"use client";
import Image from "next/image";
import Button from "./Button";
import Link from "next/link";

type Props = {};

const StravaButton = (props: Props) => {
  return (
    <Link
      href={"https://www.strava.com/dashboard"}
      target="_blank"
      className="btn btn-outline w-56">
      Strava
      <Image
        src="/strava_logo_2.svg"
        alt="Strava Logo"
        width={24}
        height={24}
      />
    </Link>
  );
};

export default StravaButton;
