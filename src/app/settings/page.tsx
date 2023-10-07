import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Settings() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div>
      <h1>Settings</h1>
    </div>
  );
}
