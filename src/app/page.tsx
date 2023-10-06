import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import SignInButton from "@/components/auth/SignInButton";
import AuthStravaButton from "@/components/auth/AuthStravaButton";
import prisma from "../../prisma/db";
import MainPageButtons from "@/components/mainPage/MainPageButtons";
import { User } from "@prisma/client";
import { checkAndRefreshStravaAuth } from "@/strava/AuthFunctions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="text-6xl">Welcome to StravaTools</div>
        <SignInButton />
      </main>
    );
  }
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="text-6xl">Welcome to StravaTools</div>
        <SignInButton />
      </main>
    );
  }
  if (!user.stravaAuthorized) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="text-4xl">Please Authorize with Strava</div>
        <AuthStravaButton user_id={session.user.id} />
      </main>
    );
  }

  await checkAndRefreshStravaAuth(user);

  return (
    <main className="flex min-h-screen gap-16 flex-col items-center p-24">
      <MainPageButtons user={user} />
    </main>
  );
}
