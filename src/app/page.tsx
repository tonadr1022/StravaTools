import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import SignInButton from "@/components/auth/SignInButton";
import AuthStravaButton from "@/components/auth/AuthStravaButton";
// import prisma from "../../prisma/db";
import { prisma } from "../../prisma/db";
import { checkAndRefreshStravaAuth } from "@/strava/AuthFunctions";
import GenerateLogModule from "@/components/logGeneration/GenerateLogModule";
import StravaButton from "@/components/common/StravaButton";
import Header from "@/components/Header";

export default async function Home() {
  const session = await getServerSession(authOptions);
  let user = null;
  if (session) {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
  }
  if (user) {
    await checkAndRefreshStravaAuth(user);
  }
  return (
    <>
      <Header user={user} />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {!session ||
          (!user && (
            <>
              <div className="text-6xl">Welcome to StravaTools</div>
              <SignInButton />
            </>
          ))}
        {user && !user?.stravaAuthorized && (
          <>
            <div className="text-4xl">Please Authorize with Strava</div>
            <AuthStravaButton user_id={session.user.id} />
          </>
        )}
        <div className="flex flex-col gap-6 min-w-full justify-ceter place-items-center">
          <StravaButton />
          <GenerateLogModule user={user!} />
          <button className="btn">Generate Activities CSV</button>

          {/* <button className="btn">View Maps</button> */}
        </div>
      </main>
    </>
  );
}
