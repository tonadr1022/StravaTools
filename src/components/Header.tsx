import React from "react";
// import { User } from "@prisma/client";
import SignInButton from "./auth/SignInButton";
import { IoSettingsSharp } from "react-icons/io5";
import LogoutButton from "./auth/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "../../prisma/db";
import Link from "next/link";

type Props = {
  // user: User | null;
};

const Header = async (props: Props) => {
  const session = await getServerSession(authOptions);
  let user = null;
  if (session) {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
  }
  return (
    <div className="w-full h-20 bg-base-100 fixed flex items-center p-4 shadow-2xl">
      <Link className="text-accent text-4xl flex-1" href="/">
        StravaTools
      </Link>
      {user ? (
        <div className="flex gap-4">
          <Link className=" btn btn-outline rounded-full" href="/settings">
            <IoSettingsSharp className="w-5 h-5" />
          </Link>
          <LogoutButton />
        </div>
      ) : (
        <SignInButton />
      )}
    </div>
  );
};

export default Header;
