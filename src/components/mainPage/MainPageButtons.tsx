"use client";
import { User } from "@prisma/client";
import GenerateLogModule from "../logGeneration/GenerateLogModule";

type Props = {
  user: User;
};

const MainPageButtons = ({ user }: Props) => {
  return (
    <div className="flex flex-col gap-10 min-w-full justify-ceter">
      <GenerateLogModule user={user} />
      <button className="btn">Generate Activities CSV</button>
      <button className="btn">Go to Strava</button>
      <button className="btn">View Maps</button>
    </div>
  );
};

export default MainPageButtons;
