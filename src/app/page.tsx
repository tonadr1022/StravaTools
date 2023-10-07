import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import SignInButton from "@/components/auth/SignInButton";
import AuthStravaButton from "@/components/auth/AuthStravaButton";
import { prisma } from "../../prisma/db";
import { checkAndRefreshStravaAuth } from "@/strava/AuthFunctions";
import GenerateLogModule from "@/components/logGeneration/GenerateLogModule";
import StravaButton from "@/components/common/StravaButton";

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
      <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-base-300">
        {!user && (
          <div className="flex flex-col gap-10 text-center place-items-center">
            <div className="text-6xl text-accent">Welcome to StravaTools</div>
            <SignInButton />
          </div>
        )}
        {user && !user?.stravaAuthorized && (
          <>
            <div className="text-4xl">Please Authorize with Strava</div>
            <AuthStravaButton user_id={session.user.id} />
          </>
        )}
        {user && user?.stravaAuthorized && (
          <div className="flex flex-col gap-6 min-w-full justify-ceter place-items-center">
            <GenerateLogModule user={user!} />
            <button className="btn btn-outline btn-accent">
              Generate Activities CSV
            </button>
            <StravaButton />
            {/* <button className="btn">View Maps</button> */}
          </div>
        )}
      </main>
    </>
  );
}
