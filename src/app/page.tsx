import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import SignInButton from "@/components/auth/SignInButton";
import AuthStravaButton from "@/components/auth/AuthStravaButton";
import { prisma } from "../../prisma/db";
import { checkAndRefreshStravaAuth } from "@/strava/AuthFunctions";
import GenerateLogModule from "@/components/logGeneration/GenerateLogModule";
import StravaButton from "@/components/common/StravaButton";
import GenerateCsv from "@/components/fileGeneration/GenerateCsv";
import GenerateJson from "@/components/fileGeneration/GenerateJson";

export default async function Home() {
  const session = await getServerSession(authOptions);
  let user = null;

  if (session) {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
  }
  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-base-300">
        <div className="flex flex-col gap-10 text-center place-items-center">
          <div className="text-6xl text-accent">Welcome to StravaTools</div>
          <SignInButton />
        </div>
      </main>
    );
  }
  await checkAndRefreshStravaAuth(user);
  const settings = await prisma.settings.findUnique({
    where: { userId: user.id },
  });

  if (!settings) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-base-300">
        <div className="text-4xl">Server Error</div>
      </main>
    );
  }
  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-24 bg-base-300">
        {!user?.stravaAuthorized ? (
          <div className="flex flex-col gap-16">
            <div className="text-4xl text-center">
              Please Authorize with Strava
            </div>
            <AuthStravaButton user_id={session.user.id} />
          </div>
        ) : (
          <div className="flex flex-col gap-6 items-center">
            <GenerateLogModule user={user!} settings={settings!} />
            <GenerateCsv user={user} />
            <GenerateJson user={user} />
            <StravaButton />
            {/* <button className="btn">View Maps</button> */}
          </div>
        )}
      </main>
    </>
  );
}
