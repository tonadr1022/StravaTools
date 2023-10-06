import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const { user } = await getServerSession(authOptions);
  const user_id = user.id;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>test: {user_id}</div>
      <button>Authorize Strava</button>
    </main>
  );
}
