import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const d = await getServerSession(authOptions);
  const id = d?.user.id;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>test: {id}</div>
      <button>Authorize Strava</button>
    </main>
  );
}
