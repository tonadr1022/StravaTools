import React from "react";
import LogoutButton from "./auth/LogoutButton";
import { User } from "@prisma/client";

type Props = {
  user: User | null;
};

const Header = async ({ user }: Props) => {
  return (
    <div className="w-full h-16 bg-base-100 fixed flex items-center p-4 shadow-2xl">
      <div className="text-accent text-4xl flex-1">StravaTools</div>
      {user ? (
        <LogoutButton />
      ) : (
        <a className="btn btn-outline btn-secondary">Login</a>
      )}
    </div>
  );
};

export default Header;
